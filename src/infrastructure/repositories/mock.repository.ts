import type { IReportRepository } from '@/domain/repositories/report.repository.interface.js';
import { ReportId } from '@/domain/entities/report/report-id.js';
import { ReportEntity } from '@/domain/entities/report/report.entity.js';

export class MockReportRepository implements IReportRepository {
  private storage = new Map<string, ReportEntity>();

  findById(reportId: ReportId): Promise<ReportEntity | null> {
    const report = this.storage.get(reportId.value);

    return Promise.resolve(report ?? null);
  }

  add(report: ReportEntity): Promise<void> {
    this.storage.set(report.id, report);

    return Promise.resolve();
  }

  deleteById(reportId: ReportId): Promise<void> {
    this.storage.delete(reportId.value);

    return Promise.resolve();
  }
}
