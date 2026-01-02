
"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import fs from 'fs/promises';
import path from 'path';
import JSZip from 'jszip';
import { updateConfig } from "./api/status/route";
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function login(formData: FormData) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  const username = formData.get("username");
  const password = formData.get("password");

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    session.isLoggedIn = true;
    await session.save();
    redirect("/");
  } else {
    redirect("/login?error=Invalid credentials");
  }
}

export async function logout() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  session.destroy();
  redirect("/login");
}

export async function unlockSettings(formData: FormData) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  const password = formData.get("password") as string;
  
  if (!password) {
    return { error: "Пароль не может быть пустым." };
  }

  const settingsPassword = process.env.SETTINGS_PASSWORD;

  if (!settingsPassword) {
      return { error: "Пароль настроек не задан в переменных окружения." };
  }
  
  if (password === settingsPassword) {
    session.isSettingsUnlocked = true;
    await session.save();
    return { success: true };
  } else {
    return { error: "Неверный пароль." };
  }
}

export async function lockSettings() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    session.isSettingsUnlocked = false;
    await session.save();
    redirect('/');
}

async function readFiles(dir: string, zip: JSZip, root: string) {
  try {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const fullPath = path.join(dir, dirent.name);
      if (['node_modules', '.next', '.git', 'logs', 'backups'].includes(dirent.name)) {
        continue;
      }
      const relativePath = path.relative(root, fullPath);
      if (dirent.isDirectory()) {
        await readFiles(fullPath, zip, root);
      } else {
        const content = await fs.readFile(fullPath);
        zip.file(relativePath, content);
      }
    }
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return;
    }
    throw error;
  }
}

export async function downloadProject(): Promise<{ success: boolean; file: string; fileName: string; }> {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isSettingsUnlocked) {
      throw new Error("Доступ запрещен. Вы должны разблокировать настройки.");
  }
  
  const zip = new JSZip();
  const projectRoot = process.cwd();
  
  await readFiles(projectRoot, zip, projectRoot);

  const zipAsBase64 = await zip.generateAsync({ type: "base64" });

  return {
    success: true,
    file: zipAsBase64,
    fileName: `Funpay Scraper MooNTooL UI-${new Date().toISOString().split('T')[0]}.zip`
  };
}


async function executeGitSync(repoUrl: string, token: string) {
    const projectRoot = process.cwd();
    const tempDir = path.join(projectRoot, `temp-github-sync-${Date.now()}`);
    const authenticatedUrl = repoUrl.replace('https://', `https://${token}@`);

    try {
        await fs.rm(tempDir, { recursive: true, force: true });
        await fs.mkdir(tempDir, { recursive: true });

        const projectFiles = await fs.readdir(projectRoot);
        for (const file of projectFiles) {
            if (file !== path.basename(tempDir)) {
                const sourcePath = path.join(projectRoot, file);
                const destPath = path.join(tempDir, file);
                await execAsync(`cp -r "${sourcePath}" "${destPath}"`);
            }
        }
        
        const execInTemp = (command: string) => execAsync(command, { cwd: tempDir });

        await execInTemp('git init');
        await execInTemp(`git config user.name "GitHub Sync"`);
        await execInTemp(`git config user.email "sync@action.local"`);
        await execInTemp(`git remote add origin ${authenticatedUrl}`);
        
        await execInTemp('git checkout --orphan temp_branch');
        await execInTemp('git add -A');
        await execInTemp(`git commit -m "Полная замена файлов: ${new Date().toISOString()}"`);
        
        await execInTemp('git branch -D main 2>/dev/null || true');
        await execInTemp('git branch -m main');

        const { stdout, stderr } = await execInTemp('git push -f origin main');
        
        return { success: true, message: `Репозиторий ${repoUrl} полностью перезаписан. \nstdout: ${stdout}\nstderr: ${stderr}` };

    } catch (error: any) {
        console.error(`GitHub Sync Error for ${repoUrl}:`, error);
        throw new Error(error.stderr || error.stdout || error.message || "Произошла неизвестная ошибка при синхронизации.");
    } finally {
        await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
}


export async function syncWithGitHub({ profiles }: { profiles: { repoUrl: string; token: string }[] }): Promise<{ success: boolean; message: string; error?: string }> {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    if (!session.isSettingsUnlocked) {
        return { success: false, message: "Доступ запрещен. Вы должны разблокировать настройки." };
    }

    if (!profiles || profiles.length === 0) {
        return { success: false, message: "Профили для синхронизации не предоставлены." };
    }

    const results = await Promise.allSettled(
        profiles.map(p => executeGitSync(p.repoUrl, p.token))
    );

    const successfulSyncs = results.filter(r => r.status === 'fulfilled').length;
    const failedSyncs = results.length - successfulSyncs;

    let finalMessage = `Синхронизация завершена. Успешно: ${successfulSyncs}. Неудачно: ${failedSyncs}.\n\n`;

    results.forEach((result, index) => {
        const repoUrl = profiles[index].repoUrl;
        if (result.status === 'fulfilled') {
            finalMessage += `✅ ${repoUrl}: Успех.\n`;
        } else {
            finalMessage += `❌ ${repoUrl}: Ошибка - ${result.reason?.message}\n`;
        }
    });

    return {
        success: failedSyncs === 0,
        message: finalMessage,
        error: failedSyncs > 0 ? "Одна или несколько синхронизаций не удались." : undefined,
    };
}
