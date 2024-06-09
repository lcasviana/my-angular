import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from "@angular/cdk/drag-drop";
import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from "@angular/core";

export type MyTableData = Record<string, unknown>;

@Component({
  selector: "my-table",
  template: `
    <table>
      <thead>
        <tr cdkDropList (cdkDropListDropped)="reorderCols($event)">
          <th>#</th>
          @for (col of cols(); track col) {
            <th cdkDrag>{{ col }}</th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of data(); track $index) {
          <tr>
            <td>{{ $index }}</td>
            @for (col of cols(); track col) {
              <td>{{ row[col] }}</td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkDropList, CdkDrag],
})
export class MyTableComponent<T extends MyTableData> {
  data = input.required<Array<T>>();
  cols = input.required<Array<keyof T>>();

  protected reorderCols(event: CdkDragDrop<Array<keyof T>>) {
    moveItemInArray(this.cols(), event.previousIndex, event.currentIndex);
  }
}
