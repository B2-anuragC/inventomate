import { PipelineStage } from 'mongoose';

export abstract class Report {
  abstract aggregateQuery: PipelineStage[];

  abstract project: Object;

  abstract generatePdf(): Array<ArrayBuffer>;
  abstract mapData(): Array<Array<any>>;
}
