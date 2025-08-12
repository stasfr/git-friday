import { ReportId } from '@/domain/entities/report/report-id.js';
import { ReportEntity } from '@/domain/entities/report/report.entity.js';

import type { IReportRepository } from '@/domain/repositories/report.repository.interface.js';

import type { LowDatabase } from '@/infrastructure/db/lowdb.client.js';
import { toDomain, toPersistence } from '@/infrastructure/repositories/report.mapper.js';

export class JsonReportRepository implements IReportRepository {
  private client: LowDatabase;

  constructor(client: LowDatabase) {
    this.client = client;
  }

  async findById(reportId: ReportId): Promise<ReportEntity | null> {
    await this.client.read();

    const persistedReport = this.client.data.reports.find((report) => report.id === reportId.value);

    if (!persistedReport) {
      return null;
    }

    const report = toDomain(persistedReport);

    return report;
  }

  async add(report: ReportEntity): Promise<void> {
    await this.client.read();

    const persistedReport = toPersistence(report);

    this.client.data.reports.push(persistedReport);

    await this.client.write();
  }

  async deleteById(reportId: ReportId): Promise<void> {
    await this.client.read();

    const index = this.client.data.reports.findIndex((report) => report.id === reportId.value);

    if (index !== -1) {
      this.client.data.reports.splice(index, 1);
    }

    await this.client.write();
  }
}
