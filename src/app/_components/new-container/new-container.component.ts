import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from 'src/app/_models/container';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContainersService } from 'src/app/_services/containers.service';


@Component({
  selector: 'app-new-container',
  templateUrl: './new-container.component.html',
  styleUrls: ['./new-container.component.scss']
})
export class NewContainerComponent implements OnInit {
  newContainerForm: FormGroup;
  submitted = false;
  loading = false;
  units = 'Inches';

  constructor(
    private formBuilder: FormBuilder,
    public newContainerRef: MatDialogRef<NewContainerComponent>,
    private containersService: ContainersService,
    @Inject(MAT_DIALOG_DATA) public newContainer: Container) { }

  onNoClick(): void {
    this.newContainerRef.close();
  }

  ngOnInit(): void {
    this.newContainerForm = this.formBuilder.group({
      width: ['', [Validators.required]],
      length: ['', [Validators.required]],
      height: ['', [Validators.required]]
    });
  }

  save() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.newContainerForm.invalid) {
      return;
    }

    this.newContainer = new Container(this.newContainerForm.get('width').value, this.newContainerForm.get('length').value, this.newContainerForm.get('height').value)
    this.loading = true;
    this.containersService.postContainer(this.newContainer).subscribe(newContainer => { console.log(newContainer); this.newContainerRef.close(newContainer); })
  }

  close() {
    this.newContainerRef.close();
  }

}
