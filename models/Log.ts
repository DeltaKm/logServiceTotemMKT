import mongoose, { Schema, model, models } from 'mongoose';

export type LogLevel = 'success' | 'error' | 'warning' | 'info';

export interface ILog {
  app: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  stackTrace?: string;
  userId?: string;
  environment?: string;
}

const LogSchema = new Schema<ILog>({
  app: {
    type: String,
    required: true,
    index: true,
  },
  level: {
    type: String,
    enum: ['success', 'error', 'warning', 'info'],
    required: true,
    index: true,
  },
  message: {
    type: String,
    required: true,
  },
  metadata: {
    type: Schema.Types.Mixed,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  stackTrace: {
    type: String,
  },
  userId: {
    type: String,
    index: true,
  },
  environment: {
    type: String,
    enum: ['development', 'staging', 'production'],
    default: 'production',
  },
}, {
  timestamps: true,
});

// Crea indici composti per query più efficienti
LogSchema.index({ app: 1, timestamp: -1 });
LogSchema.index({ app: 1, level: 1, timestamp: -1 });

const Log = models.Log || model<ILog>('Log', LogSchema);

export default Log;
