import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from 'src/app/_models/container';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContainersService } from 'src/app/_services/containers.service';
import { evaluate } from 'mathjs'


@Component({
  selector: 'app-new-container',
  templateUrl: './new-container.component.html',
  styleUrls: ['./new-container.component.scss']
})
export class NewContainerComponent implements OnInit {
  newContainerForm: FormGroup;
  submitted = false;
  loading = false;
  units = 'mm';

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
      sku: ['', []],
      description: ['', [Validators.required]],
      xDim: ['', [Validators.required, Validators.pattern(/[0-9|.|+|-|/|*]/g)]],
      yDim: ['', [Validators.required, Validators.pattern(/[0-9|.|+|-|/|*]/g)]],
      zDim: ['', [Validators.required, Validators.pattern(/[0-9|.|+|-|/|*]/g)]]
    });
  }

  save() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.newContainerForm.invalid) {
      return;
    }

    //evaluate expression
    this.newContainerForm.controls.xDim.setValue(evaluate(this.newContainerForm.controls.xDim.value))
    this.newContainerForm.controls.yDim.setValue(evaluate(this.newContainerForm.controls.yDim.value))
    this.newContainerForm.controls.zDim.setValue(evaluate(this.newContainerForm.controls.zDim.value))
    //remove errors
    this.newContainerForm.controls.xDim.setErrors(null)
    this.newContainerForm.controls.yDim.setErrors(null)
    this.newContainerForm.controls.zDim.setErrors(null)

    this.newContainer = new Container(this.newContainerForm.value)
    this.loading = true;
    console.log("units:", this.units)
    this.containersService.postContainer(this.newContainer).subscribe(newContainer => this.newContainerRef.close(newContainer))
  }

  close() {
    this.newContainerRef.close();
  }

}
