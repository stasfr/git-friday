import { ReportId } from '@/domain/entities/report/report-id.js';
import { ReportEntity } from '@/domain/entities/report/report.entity.js';

export interface IReportRepository {
  findById(reportId: ReportId): Promise<ReportEntity | null>;
  add(report: ReportEntity): Promise<void>;
  deleteById(reportId: ReportId): Promise<void>;
}
