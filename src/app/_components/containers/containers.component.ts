import { Component, OnInit } from '@angular/core';
import { ContainersService } from 'src/app/_services/containers.service';
import { Container } from 'src/app/_models/container';
import { MatDialog } from '@angular/material/dialog';
import { NewContainerComponent } from 'src/app/_components/new-container/new-container.component';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.scss']
})
export class ContainersComponent implements OnInit {
  containers: Container[];
  dataSource;
  displayedColumns: string[] = ['width', 'height', 'length'];

  constructor(private containersservice: ContainersService, public newContainerDialog: MatDialog) { }

  ngOnInit(): void {
    this.containersservice.getAll().subscribe(containers => { this.containers = containers; this.dataSource = new MatTableDataSource(containers); console.log(containers) })
  }


  openDialog(): void {
    const dialogRef = this.newContainerDialog.open(NewContainerComponent, {
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(newContainer => {
      if (newContainer) {
        console.log("new container", newContainer);
        this.containers.unshift(newContainer)
        this.dataSource = new MatTableDataSource(this.containers);
      }
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
