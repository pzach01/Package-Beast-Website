import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from 'src/app/_models/container';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContainersService } from 'src/app/_services/containers.service';


@Component({
  selector: 'app-edit-container',
  templateUrl: './edit-container.component.html',
  styleUrls: ['./edit-container.component.scss']
})
export class EditContainerComponent implements OnInit {
  editContainerForm: FormGroup;
  submitted = false;
  loading = false;
  units = 'Inches';

  constructor(
    private formBuilder: FormBuilder,
    public editContainerRef: MatDialogRef<EditContainerComponent>,
    private containersService: ContainersService,
    @Inject(MAT_DIALOG_DATA) public editContainer: Container) { }

  onNoClick(): void {
    this.editContainerRef.close();
  }

  ngOnInit(): void {
    this.editContainerForm = this.formBuilder.group({
      sku: [this.editContainer.sku, []],
      description: [this.editContainer.description, [Validators.required]],
      width: [this.editContainer.width, [Validators.required]],
      length: [this.editContainer.length, [Validators.required]],
      height: [this.editContainer.height, [Validators.required]]
    });
  }

  save() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editContainerForm.invalid) {
      return;
    }

    this.editContainer = { ...this.editContainer, ...this.editContainerForm.value }

    this.loading = true;
    this.containersService.putContainer(this.editContainer).subscribe(editContainer => this.editContainerRef.close(editContainer))
  }

  close() {
    this.editContainerRef.close();
  }

}

