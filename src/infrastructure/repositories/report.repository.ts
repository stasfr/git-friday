import { ReportId } from '@/domain/entities/report/report-id.js';
import { ReportEntity } from '@/domain/entities/report/report.entity.js';

import type { IReportRepository } from '@/domain/repositories/report.repository.interface.js';

import type { LowDatabase } from '@/infrastructure/db/lowdb.client.js';
import { toDomain, toPersistence } from '@/infrastructure/repositories/report.mapper.js';

interface JsonReportRepositoryDependencies { dbClient: LowDatabase; }

export class JsonReportRepository implements IReportRepository {
  private dependenciesContainer: JsonReportRepositoryDependencies;

  constructor(dependenciesContainer: JsonReportRepositoryDependencies) {
    this.dependenciesContainer = dependenciesContainer;
  }

  async findById(reportId: ReportId): Promise<ReportEntity | null> {
    await this.dependenciesContainer.dbClient.read();

    const persistedReport = this.dependenciesContainer.dbClient.data.reports.find((report) => report.id === reportId.value);

    if (!persistedReport) {
      return null;
    }

    const report = toDomain(persistedReport);

    return report;
  }

  async add(report: ReportEntity): Promise<void> {
    await this.dependenciesContainer.dbClient.read();

    const persistedReport = toPersistence(report);

    this.dependenciesContainer.dbClient.data.reports.push(persistedReport);

    await this.dependenciesContainer.dbClient.write();
  }

  async deleteById(reportId: ReportId): Promise<void> {
    await this.dependenciesContainer.dbClient.read();

    const index = this.dependenciesContainer.dbClient.data.reports.findIndex((report) => report.id === reportId.value);

    if (index !== -1) {
      this.dependenciesContainer.dbClient.data.reports.splice(index, 1);
    }

    await this.dependenciesContainer.dbClient.write();
  }
}
