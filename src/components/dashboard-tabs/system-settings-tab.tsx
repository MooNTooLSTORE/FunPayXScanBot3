

"use client";

import React, { useState } from "react";
import { lockSettings } from "@/app/actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Lock,
  Loader2,
  Download,
  Upload,
  Trash2,
  Archive,
  ShieldCheck,
  DatabaseZap,
  Play,
  StopCircle,
  GitBranch,
  PlusCircle,
  Edit,
  Send,
} from "lucide-react";
import type { BackgroundExportStatus, GitHubSyncProfile } from "@/types";

interface GitHubProfileEditorProps {
  profile?: GitHubSyncProfile;
  onSave: (profile: GitHubSyncProfile) => void;
  onCancel: () => void;
  isSaving: boolean;
}

function GitHubProfileEditor({ profile, onSave, onCancel, isSaving }: GitHubProfileEditorProps) {
    const [currentProfile, setCurrentProfile] = useState<Partial<GitHubSyncProfile>>(profile || { id: '', name: '', repoUrl: '', token: '' });

    const handleSaveClick = () => {
        if (!currentProfile.name || !currentProfile.repoUrl || !currentProfile.token) {
            alert('Все поля должны быть заполнены.');
            return;
        }
        onSave(currentProfile as GitHubSyncProfile);
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{profile?.id ? 'Редактировать профиль' : 'Новый профиль синхронизации'}</DialogTitle>
                <DialogDescription>
                    Укажите данные для синхронизации с репозиторием GitHub.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="profile-name">Название профиля</Label>
                    <Input id="profile-name" value={currentProfile.name} onChange={(e) => setCurrentProfile(p => ({ ...p, name: e.target.value }))} placeholder="Например, Основной сервер" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="profile-repo">URL репозитория</Label>
                    <Input id="profile-repo" value={currentProfile.repoUrl} onChange={(e) => setCurrentProfile(p => ({ ...p, repoUrl: e.target.value }))} placeholder="https://github.com/user/repo.git" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="profile-token">Токен доступа</Label>
                    <Input id="profile-token" type="password" value={currentProfile.token} onChange={(e) => setCurrentProfile(p => ({ ...p, token: e.target.value }))} placeholder="ghp_..." />
                </div>
            </div>
            <DialogFooter>
                <Button variant="secondary" onClick={onCancel}>Отмена</Button>
                <Button onClick={handleSaveClick} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Сохранить
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}

interface SystemSettingsTabProps {
  workerId: string;
  scrapingTarget: number;
  setScrapingTarget: (val: number) => void;
  scraperBatchSize: number;
  setScraperBatchSize: (val: number) => void;
  scraperIntegrityCheckBatchSize: number;
  setScraperIntegrityCheckBatchSize: (val: number) => void;
  scraperWriteBatchSize: number;
  setScraperWriteBatchSize: (val: number) => void;
  scraperRecentProfilesLimit: number;
  setScraperRecentProfilesLimit: (val: number) => void;
  telegramLogsLimit: number;
  setTelegramLogsLimit: (val: number) => void;
  scraperConsecutiveErrorLimit: number;
  setScraperConsecutiveErrorLimit: (val: number) => void;
  scraperPauseDuration: number;
  setScraperPauseDuration: (val: number) => void;
  projectLogsTtl: number;
  setProjectLogsTtl: (val: number) => void;
  handleBlurSave: (value: any, key: string) => void;
  scraperParallelRequestLimitMin: number;
  setScraperParallelRequestLimitMin: (val: number) => void;
  scraperParallelRequestLimitMax: number;
  setScraperParallelRequestLimitMax: (val: number) => void;
  scraperAdaptiveDelayMin: number;
  setScraperAdaptiveDelayMin: (val: number) => void;
  scraperAdaptiveDelayMax: number;
  setScraperAdaptiveDelayMax: (val: number) => void;
  scraperAdaptiveDelayStep: number;
  setScraperAdaptiveDelayStep: (val: number) => void;
  scraperSuccessStreak: number;
  setScraperSuccessStreak: (val: number) => void;
  scraperAnalysisWindow: number;
  setScraperAnalysisWindow: (val: number) => void;
  scraperSuccessThreshold: number;
  setScraperSuccessThreshold: (val: number) => void;
  fileLoggingEnabled: boolean;
  setFileLoggingEnabled: (val: boolean) => void;
  scraperSkipIntegrityCheck: boolean;
  setScraperSkipIntegrityCheck: (val: boolean) => void;
  handleSaveConfig: (config: any) => void;
  handleDownloadLogFile: () => void;
  handleClearLogFile: () => void;
  isImporting: boolean;
  handleTriggerImport: () => void;
  isImportingTg: boolean;
  handleTriggerImportTg: () => void;
  isDownloadingProject: boolean;
  handleDownloadProject: () => void;
  handleClearDB: () => void;
  bgExportStatus: BackgroundExportStatus;
  handleBgExportAction: (action: 'start' | 'stop' | 'clear') => void;
  isBgExportActionLoading: boolean;
  tgBgExportStatus: BackgroundExportStatus;
  handleTgBgExportAction: (action: 'start' | 'stop' | 'clear') => void;
  isTgBgExportActionLoading: boolean;
  githubSyncProfiles: GitHubSyncProfile[];
  handleSaveGitHubProfile: (profile: GitHubSyncProfile) => void;
  handleDeleteGitHubProfile: (profileId: string) => void;
  handleSyncWithGitHub: (profiles: {repoUrl: string, token: string}[]) => void;
  isSyncing: string | boolean;
}


export function SystemSettingsTab({
  workerId,
  scrapingTarget, setScrapingTarget,
  scraperBatchSize, setScraperBatchSize,
  scraperIntegrityCheckBatchSize, setScraperIntegrityCheckBatchSize,
  scraperWriteBatchSize, setScraperWriteBatchSize,
  scraperRecentProfilesLimit, setScraperRecentProfilesLimit,
  telegramLogsLimit, setTelegramLogsLimit,
  scraperConsecutiveErrorLimit, setScraperConsecutiveErrorLimit,
  scraperPauseDuration, setScraperPauseDuration,
  projectLogsTtl, setProjectLogsTtl,
  handleBlurSave,
  scraperParallelRequestLimitMin, setScraperParallelRequestLimitMin,
  scraperParallelRequestLimitMax, setScraperParallelRequestLimitMax,
  scraperAdaptiveDelayMin, setScraperAdaptiveDelayMin,
  scraperAdaptiveDelayMax, setScraperAdaptiveDelayMax,
  scraperAdaptiveDelayStep, setScraperAdaptiveDelayStep,
  scraperSuccessStreak, setScraperSuccessStreak,
  scraperAnalysisWindow, setScraperAnalysisWindow,
  scraperSuccessThreshold, setScraperSuccessThreshold,
  fileLoggingEnabled, setFileLoggingEnabled,
  scraperSkipIntegrityCheck, setScraperSkipIntegrityCheck,
  handleSaveConfig,
  handleDownloadLogFile, handleClearLogFile,
  isImporting, handleTriggerImport,
  isImportingTg, handleTriggerImportTg,
  isDownloadingProject, handleDownloadProject,
  handleClearDB,
  bgExportStatus, handleBgExportAction, isBgExportActionLoading,
  tgBgExportStatus, handleTgBgExportAction, isTgBgExportActionLoading,
  githubSyncProfiles, handleSaveGitHubProfile, handleDeleteGitHubProfile, handleSyncWithGitHub, isSyncing,
}: SystemSettingsTabProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<GitHubSyncProfile | undefined>(undefined);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const onSaveProfile = (profileData: GitHubSyncProfile) => {
    setIsSavingProfile(true);
    handleSaveGitHubProfile(profileData);
    setTimeout(() => {
      setIsSavingProfile(false);
      setIsEditorOpen(false);
    }, 500); // Give it a moment to show feedback
  };

  return (
    <>
      <Card className="bg-secondary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Настройки Системы</CardTitle>
              <CardDescription>Управление подключениями, скрейпером и глобальными данными.</CardDescription>
            </div>
            <form action={lockSettings}>
              <Button variant="outline">
                <Lock className="mr-2 h-4 w-4" />
                Заблокировать
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="worker-id">Идентификатор воркера (из env)</Label>
            <Input id="worker-id" placeholder="worker-1" value={workerId} readOnly disabled className="bg-card cursor-not-allowed" />
            <p className="text-xs text-muted-foreground">Этот ID берется из переменной окружения `WORKER_ID` и не может быть изменен здесь.</p>
          </div>
          <Separator />

          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Настройки Скрейпера (Глобальные)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                  <Label htmlFor="scraper-target-goal">Цель скрейпинга (кол-во профилей)</Label>
                  <Input id="scraper-target-goal" type="number" placeholder="17000000" value={scrapingTarget} onChange={(e) => setScrapingTarget(Number(e.target.value))} onBlur={() => handleBlurSave(scrapingTarget, 'SCRAPER_TARGET_GOAL')} className="bg-card" />
                  <p className="text-xs text-muted-foreground">Количество профилей для расчета прогноза.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scraper-batch-size">Размер пачки для парсинга</Label>
                <Input id="scraper-batch-size" type="number" placeholder="25" value={scraperBatchSize} onChange={(e) => setScraperBatchSize(Number(e.target.value))} onBlur={() => handleBlurSave(scraperBatchSize, 'SCRAPER_BATCH_SIZE')} className="bg-card" />
                <p className="text-xs text-muted-foreground">Кол-во ID, которое воркер берет из Redis за раз.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="integrity-check-batch-size">Размер пачки для проверки целостности</Label>
                <Input id="integrity-check-batch-size" type="number" placeholder="50000" value={scraperIntegrityCheckBatchSize} onChange={(e) => setScraperIntegrityCheckBatchSize(Number(e.target.value))} onBlur={() => handleBlurSave(scraperIntegrityCheckBatchSize, 'SCRAPER_INTEGRITY_CHECK_BATCH_SIZE')} className="bg-card" />
                <p className="text-xs text-muted-foreground">Кол-во ID в одной пачке для проверки.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scraper-write-batch-size">Размер пачки для записи в БД</Label>
                <Input id="scraper-write-batch-size" type="number" placeholder="50" value={scraperWriteBatchSize} onChange={(e) => setScraperWriteBatchSize(Number(e.target.value))} onBlur={() => handleBlurSave(scraperWriteBatchSize, 'SCRAPER_WRITE_BATCH_SIZE')} className="bg-card" />
                <p className="text-xs text-muted-foreground">Кол-во профилей для накопления перед записью в MongoDB.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recent-profiles-limit">Лимит лога сессии</Label>
                <Input id="recent-profiles-limit" type="number" placeholder="100" value={scraperRecentProfilesLimit} onChange={(e) => setScraperRecentProfilesLimit(Number(e.target.value))} onBlur={() => handleBlurSave(scraperRecentProfilesLimit, 'SCRAPER_RECENT_PROFILES_LIMIT')} className="bg-card" />
                <p className="text-xs text-muted-foreground">Макс. кол-во профилей в логе на главной.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegram-logs-limit">Лимит логов Telegram</Label>
                <Input id="telegram-logs-limit" type="number" placeholder="200" value={telegramLogsLimit} onChange={(e) => setTelegramLogsLimit(Number(e.target.value))} onBlur={() => handleBlurSave(telegramLogsLimit, 'TELEGRAM_LOGS_LIMIT')} className="bg-card" />
                <p className="text-xs text-muted-foreground">Макс. кол-во запросов от Telegram для хранения.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="consecutive-error-limit">Лимит ошибок 404</Label>
                <Input id="consecutive-error-limit" type="number" placeholder="100" value={scraperConsecutiveErrorLimit} onChange={(e) => setScraperConsecutiveErrorLimit(Number(e.target.value))} onBlur={() => handleBlurSave(scraperConsecutiveErrorLimit, 'SCRAPER_CONSECUTIVE_ERROR_LIMIT')} className="bg-card" />
                <p className="text-xs text-muted-foreground">Кол-во ошибок "не найдено" подряд.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pause-duration">Пауза после лимита 404 (часы)</Label>
                <Input id="pause-duration" type="number" placeholder="6" value={scraperPauseDuration} onChange={(e) => setScraperPauseDuration(Number(e.target.value))} onBlur={() => handleBlurSave(scraperPauseDuration, 'SCRAPER_PAUSE_DURATION_MS')} className="bg-card" />
                <p className="text-xs text-muted-foreground">На сколько часов остановиться после лимита 404.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-logs-ttl">Время жизни обычных логов (минуты)</Label>
                <Input id="project-logs-ttl" type="number" placeholder="60" value={projectLogsTtl} onChange={(e) => setProjectLogsTtl(Number(e.target.value))} onBlur={() => handleBlurSave(projectLogsTtl, 'PROJECT_LOGS_TTL_MINUTES')} className="bg-card" />
                <p className="text-xs text-muted-foreground">Через сколько минут удалять обычные логи проекта.</p>
              </div>
            </div>
          </div>

          <Separator />
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Настройки производительности и адаптации (Глобальные)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="parallel-limit-min">Мин. параллельных запросов</Label>
                <Input id="parallel-limit-min" type="number" value={scraperParallelRequestLimitMin} onChange={(e) => setScraperParallelRequestLimitMin(Number(e.target.value))} onBlur={() => handleBlurSave(scraperParallelRequestLimitMin, 'SCRAPER_PARALLEL_REQUEST_LIMIT_MIN')} className="bg-card" />
                <p className="text-xs text-muted-foreground">С какого кол-ва начинать.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parallel-limit-max">Макс. параллельных запросов</Label>
                <Input id="parallel-limit-max" type="number" value={scraperParallelRequestLimitMax} onChange={(e) => setScraperParallelRequestLimitMax(Number(e.target.value))} onBlur={() => handleBlurSave(scraperParallelRequestLimitMax, 'SCRAPER_PARALLEL_REQUEST_LIMIT_MAX')} className="bg-card" />
                <p className="text-xs text-muted-foreground">"Потолок" лимита.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adaptive-delay-min">Мин. адаптивная задержка (мс)</Label>
                <Input id="adaptive-delay-min" type="number" value={scraperAdaptiveDelayMin} onChange={(e) => setScraperAdaptiveDelayMin(Number(e.target.value))} onBlur={() => handleBlurSave(scraperAdaptiveDelayMin, 'SCRAPER_ADAPTIVE_DELAY_MIN_MS')} className="bg-card" />
                <p className="text-xs text-muted-foreground">Начальная пауза между пачками.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adaptive-delay-max">Макс. адаптивная задержка (мс)</Label>
                <Input id="adaptive-delay-max" type="number" value={scraperAdaptiveDelayMax} onChange={(e) => setScraperAdaptiveDelayMax(Number(e.target.value))} onBlur={() => handleBlurSave(scraperAdaptiveDelayMax, 'SCRAPER_ADAPTIVE_DELAY_MAX_MS')} className="bg-card" />
                <p className="text-xs text-muted-foreground">"Потолок" паузы.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adaptive-delay-step">Шаг изменения задержки (мс)</Label>
                <Input id="adaptive-delay-step" type="number" value={scraperAdaptiveDelayStep} onChange={(e) => setScraperAdaptiveDelayStep(Number(e.target.value))} onBlur={() => handleBlurSave(scraperAdaptiveDelayStep, 'SCRAPER_ADAPTIVE_DELAY_STEP_MS')} className="bg-card" />
                <p className="text-xs text-muted-foreground">На сколько менять паузу при адаптации (ускорение/замедление).</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="success-streak">Пачек для повышения лимита</Label>
                <Input id="success-streak" type="number" value={scraperSuccessStreak} onChange={(e) => setScraperSuccessStreak(Number(e.target.value))} onBlur={() => handleBlurSave(scraperSuccessStreak, 'SCRAPER_SUCCESS_STREAK_TO_INCREASE_LIMIT')} className="bg-card" />
                <p className="text-xs text-muted-foreground">Сколько успешных пачек нужно перед повышением лимита.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="analysis-window">Окно для анализа (шт)</Label>
                <Input id="analysis-window" type="number" value={scraperAnalysisWindow} onChange={(e) => setScraperAnalysisWindow(Number(e.target.value))} onBlur={() => handleBlurSave(scraperAnalysisWindow, 'SCRAPER_ANALYSIS_WINDOW')} className="bg-card" />
                <p className="text-xs text-muted-foreground">Кол-во последних запросов для анализа.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="success-threshold">Процент успеха для стабилизации (%)</Label>
                <Input id="success-threshold" type="number" value={scraperSuccessThreshold} onChange={(e) => setScraperSuccessThreshold(Number(e.target.value))} onBlur={() => handleBlurSave(scraperSuccessThreshold, 'SCRAPER_SUCCESS_THRESHOLD')} className="bg-card" />
                <p className="text-xs text-muted-foreground">Процент успеха для перехода в стабильный режим.</p>
              </div>
            </div>
          </div>

          <Separator />
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Управление данными</h3>
            <div className="space-y-6">
              <div className="p-4 bg-card rounded-lg border space-y-4">
                <div className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Синхронизация с GitHub</Label>
                    <CardDescription>
                      Управление профилями для отправки текущего состояния проекта в репозитории GitHub.
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                     <Button variant="outline" onClick={() => { setEditingProfile(undefined); setIsEditorOpen(true); }}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Добавить профиль
                    </Button>
                     <Button onClick={() => handleSyncWithGitHub(githubSyncProfiles)} disabled={isSyncing === true || githubSyncProfiles.length === 0}>
                       {isSyncing === true ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                       Отправить во все
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {githubSyncProfiles.length > 0 ? githubSyncProfiles.map(profile => (
                    <div key={profile.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div>
                        <p className="font-semibold text-foreground">{profile.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">{profile.repoUrl}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" title="Синхронизировать" onClick={() => handleSyncWithGitHub([profile])} disabled={!!isSyncing}>
                          {isSyncing === profile.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitBranch className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" title="Редактировать" onClick={() => { setEditingProfile(profile); setIsEditorOpen(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" title="Удалить">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Профиль "{profile.name}" будет удален. Это действие необратимо.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteGitHubProfile(profile.id)} className="bg-destructive hover:bg-destructive/90">
                                      Удалить
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Профили синхронизации еще не созданы.</p>
                  )}
                </div>
              </div>


              <div className="p-4 bg-card rounded-lg border space-y-4">
                <div className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Пропускать проверку целостности</Label>
                    <CardDescription>
                      Если включено, скрейпер пропустит долгую проверку всех ID в базе данных при первом запуске.
                    </CardDescription>
                  </div>
                  <Switch
                    checked={scraperSkipIntegrityCheck}
                    onCheckedChange={(checked) => { setScraperSkipIntegrityCheck(checked); handleSaveConfig({ SCRAPER_SKIP_INTEGRITY_CHECK: checked }); }}
                  />
                </div>
              </div>
              
               <div className="p-4 bg-card rounded-lg border space-y-4">
                <div className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Фоновый экспорт БД FunPay</Label>
                    <CardDescription>
                      Запускает процесс экспорта основной базы данных `users` на сервере. Готовый файл будет сохранен в папке `backups`.
                    </CardDescription>
                  </div>
                </div>
                <div className="space-y-2">
                  {bgExportStatus.status === 'idle' && (
                    <Button onClick={() => handleBgExportAction('start')} disabled={isBgExportActionLoading}>
                      {isBgExportActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                      Начать экспорт
                    </Button>
                  )}
                  {bgExportStatus.status === 'running' && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm text-muted-foreground">Экспорт запущен... ({bgExportStatus.progress.toLocaleString()} / {bgExportStatus.total.toLocaleString()})</p>
                        <Button variant="destructive" size="sm" onClick={() => handleBgExportAction('stop')} disabled={isBgExportActionLoading}>
                          {isBgExportActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <StopCircle className="mr-2 h-4 w-4" />}
                          Остановить
                        </Button>
                      </div>
                      <Progress value={(bgExportStatus.progress / bgExportStatus.total) * 100} />
                    </div>
                  )}
                  {bgExportStatus.status === 'completed' && (
                    <div className="p-3 bg-green-950/50 border border-green-500 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-green-400">Экспорт завершен.</p>
                        <p className="text-xs text-muted-foreground">Файл сохранен в: <code className="bg-background p-1 rounded">{bgExportStatus.filePath}</code></p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => handleBgExportAction('clear')}>
                        Очистить
                      </Button>
                    </div>
                  )}
                  {bgExportStatus.status === 'error' && (
                    <div className="p-3 bg-red-950/50 border border-destructive rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-destructive">Ошибка экспорта.</p>
                        <p className="text-xs text-muted-foreground">Ошибка: {bgExportStatus.error}</p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => handleBgExportAction('clear')}>
                        Очистить
                      </Button>
                    </div>
                  )}
                </div>
              </div>

               <div className="p-4 bg-card rounded-lg border space-y-4">
                <div className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Фоновый экспорт БД Telegram</Label>
                    <CardDescription>
                      Запускает процесс экспорта базы пользователей Telegram (`bot_users`). Готовый файл будет сохранен в папке `backups`.
                    </CardDescription>
                  </div>
                </div>
                <div className="space-y-2">
                  {tgBgExportStatus.status === 'idle' && (
                    <Button onClick={() => handleTgBgExportAction('start')} disabled={isTgBgExportActionLoading}>
                      {isTgBgExportActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                      Начать экспорт
                    </Button>
                  )}
                  {tgBgExportStatus.status === 'running' && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm text-muted-foreground">Экспорт запущен... ({tgBgExportStatus.progress.toLocaleString()} / {tgBgExportStatus.total.toLocaleString()})</p>
                        <Button variant="destructive" size="sm" onClick={() => handleTgBgExportAction('stop')} disabled={isTgBgExportActionLoading}>
                          {isTgBgExportActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <StopCircle className="mr-2 h-4 w-4" />}
                          Остановить
                        </Button>
                      </div>
                      <Progress value={(tgBgExportStatus.progress / tgBgExportStatus.total) * 100} />
                    </div>
                  )}
                  {tgBgExportStatus.status === 'completed' && (
                    <div className="p-3 bg-green-950/50 border border-green-500 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-green-400">Экспорт завершен.</p>
                        <p className="text-xs text-muted-foreground">Файл сохранен в: <code className="bg-background p-1 rounded">{tgBgExportStatus.filePath}</code></p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => handleTgBgExportAction('clear')}>
                        Очистить
                      </Button>
                    </div>
                  )}
                  {tgBgExportStatus.status === 'error' && (
                    <div className="p-3 bg-red-950/50 border border-destructive rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-destructive">Ошибка экспорта.</p>
                        <p className="text-xs text-muted-foreground">Ошибка: {tgBgExportStatus.error}</p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => handleTgBgExportAction('clear')}>
                        Очистить
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 bg-card rounded-lg border space-y-4">
                <div className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Логирование скрейпера</Label>
                    <CardDescription>
                      Включает или отключает запись логов скрейпера в файл `logs/scraper.log`.
                    </CardDescription>
                  </div>
                  <Switch
                    checked={fileLoggingEnabled}
                    onCheckedChange={(checked) => { setFileLoggingEnabled(checked); handleSaveConfig({ SCRAPER_FILE_LOGGING_ENABLED: checked }); }}
                  />
                </div>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button variant="outline" onClick={handleDownloadLogFile}>
                    <Download className="mr-2 h-4 w-4" />
                    Скачать лог-файл
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Очистить лог-файл</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие необратимо. Файл `scraper.log` будет полностью очищен.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearLogFile} className="bg-destructive hover:bg-destructive/90">
                          Да, очистить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">

                <Button variant="outline" onClick={handleTriggerImport} disabled={isImporting}>
                  {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  Импорт БД
                </Button>
                <Button variant="outline" onClick={handleTriggerImportTg} disabled={isImportingTg}>
                  {isImportingTg ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  Импорт БД ТГ
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Очистить БД</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Вы абсолютно уверены?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Это действие необратимо. Все данные скрейпинга, включая
                        статистику и найденные профили, будут навсегда удалены.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearDB} className="bg-destructive hover:bg-destructive/90">
                        Да, очистить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="outline" onClick={handleDownloadProject} disabled={isDownloadingProject}>
                  <Archive className="mr-2 h-4 w-4" />
                  {isDownloadingProject ? 'Архивация...' : 'Скачать проект'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <GitHubProfileEditor
            profile={editingProfile}
            onSave={onSaveProfile}
            onCancel={() => setIsEditorOpen(false)}
            isSaving={isSavingProfile}
        />
      </Dialog>
    </>
  );
}
