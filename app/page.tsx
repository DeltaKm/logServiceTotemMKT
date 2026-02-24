'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

type LogLevel = 'success' | 'error' | 'warning' | 'info';

interface Log {
  _id: string;
  app: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
  timestamp: string;
  stackTrace?: string;
  userId?: string;
  environment?: string;
}

interface Stats {
  byLevel: Array<{ _id: string; count: number }>;
  byApp: Array<{ _id: string; count: number; lastLog: string }>;
}

export default function Home() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [apps, setApps] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedApp, setSelectedApp] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | ''>('');
  const [loading, setLoading] = useState(false);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  useEffect(() => {
    fetchApps();
    fetchStats();
    fetchLogs();
  }, []);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [selectedApp, selectedLevel]);

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/logs/apps');
      const data = await res.json();
      if (data.success) {
        setApps(data.data);
      }
    } catch (error) {
      console.error('Errore nel recupero delle app:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const url = selectedApp ? `/api/logs/stats?app=${selectedApp}` : '/api/logs/stats';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Errore nel recupero delle statistiche:', error);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedApp) params.append('app', selectedApp);
      if (selectedLevel) params.append('level', selectedLevel);
      params.append('limit', '50');

      const res = await fetch(`/api/logs?${params}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      }
    } catch (error) {
      console.error('Errore nel recupero dei log:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  const getStatCount = (level: string) => {
    return stats?.byLevel.find(s => s._id === level)?.count || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Log Verification Dashboard
          </h1>
          <p className="text-gray-600">
            Monitora e analizza i log delle tue applicazioni in tempo reale
          </p>
        </div>

        {/* Statistiche */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Success</p>
                <p className="text-3xl font-bold text-green-600">{getStatCount('success')}</p>
              </div>
              <div className="text-4xl">✓</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Errori</p>
                <p className="text-3xl font-bold text-red-600">{getStatCount('error')}</p>
              </div>
              <div className="text-4xl">✗</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Warning</p>
                <p className="text-3xl font-bold text-yellow-600">{getStatCount('warning')}</p>
              </div>
              <div className="text-4xl">⚠</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Info</p>
                <p className="text-3xl font-bold text-blue-600">{getStatCount('info')}</p>
              </div>
              <div className="text-4xl">ℹ</div>
            </div>
          </div>
        </div>

        {/* Filtri */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🔍 Filtri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applicazione
              </label>
              <select
                value={selectedApp}
                onChange={(e) => setSelectedApp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tutte le app</option>
                {apps.map((app) => (
                  <option key={app} value={app}>
                    {app}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Livello
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as LogLevel | '')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tutti i livelli</option>
                <option value="success">✓ Success</option>
                <option value="error">✗ Error</option>
                <option value="warning">⚠ Warning</option>
                <option value="info">ℹ Info</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedApp('');
                  setSelectedLevel('');
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Reset Filtri
              </button>
            </div>
          </div>
        </div>

        {/* Lista Log */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              📝 Log ({logs.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Caricamento log...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-xl">Nessun log trovato</p>
              <p className="mt-2">Prova a modificare i filtri</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {logs.map((log) => (
                <div
                  key={log._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold border ${getLevelColor(
                            log.level
                          )}`}
                        >
                          {getLevelIcon(log.level)} {log.level.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          {log.app}
                        </span>
                        {log.environment && (
                          <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                            {log.environment}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-800 font-medium text-lg mb-2">
                        {log.message}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          🕐 {format(new Date(log.timestamp), 'dd MMM yyyy HH:mm:ss', { locale: it })}
                        </span>
                        {log.userId && <span>👤 User: {log.userId}</span>}
                      </div>

                      {(log.metadata || log.stackTrace) && (
                        <button
                          onClick={() =>
                            setExpandedLog(expandedLog === log._id ? null : log._id)
                          }
                          className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          {expandedLog === log._id ? '▼ Nascondi dettagli' : '▶ Mostra dettagli'}
                        </button>
                      )}

                      {expandedLog === log._id && (
                        <div className="mt-4 space-y-3">
                          {log.metadata && (
                            <div>
                              <p className="text-sm font-semibold text-gray-700 mb-1">
                                Metadata:
                              </p>
                              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            </div>
                          )}
                          {log.stackTrace && (
                            <div>
                              <p className="text-sm font-semibold text-gray-700 mb-1">
                                Stack Trace:
                              </p>
                              <pre className="bg-red-50 p-3 rounded text-xs overflow-x-auto text-red-800">
                                {log.stackTrace}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con info API */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📡 API Endpoints
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <code className="bg-blue-100 px-2 py-1 rounded text-blue-900">
                POST /api/logs
              </code>
              <span className="ml-2 text-gray-700">- Crea un nuovo log</span>
            </div>
            <div>
              <code className="bg-blue-100 px-2 py-1 rounded text-blue-900">
                GET /api/logs?app=nome&level=error
              </code>
              <span className="ml-2 text-gray-700">- Recupera log con filtri</span>
            </div>
            <div>
              <code className="bg-blue-100 px-2 py-1 rounded text-blue-900">
                GET /api/logs/apps
              </code>
              <span className="ml-2 text-gray-700">- Lista tutte le app</span>
            </div>
            <div>
              <code className="bg-blue-100 px-2 py-1 rounded text-blue-900">
                GET /api/logs/stats
              </code>
              <span className="ml-2 text-gray-700">- Statistiche generali</span>
            </div>
          </div>
          <div className="mt-6 text-center">
            <a
              href="/api-docs"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
            >
              📚 Vai alla Documentazione Completa →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
