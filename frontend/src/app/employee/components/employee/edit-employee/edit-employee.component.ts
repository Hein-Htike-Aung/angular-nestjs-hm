import { ActivatedRoute, Router } from '@angular/router';
import { Division } from './../../../models/division.model';
import { Position } from './../../../models/position.model';
import { PositionService } from './../../../services/position.service';
import { DivisionService } from './../../../services/division.service';
import { ErrorMatcher } from './../../../../core/error-matcher';
import {
  Employee,
  EmployeeRequestPayload,
} from './../../../models/employee.model';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from './../../../services/employee.service';
import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { from, of, switchMap, tap } from 'rxjs';
import { FileTypeResult } from 'file-type';
import { fromBuffer } from 'file-type/core';

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss'],
})
export class EditEmployeeComponent implements OnInit, AfterViewInit {
  basicInfoForm: FormGroup;
  personalInfoForm: FormGroup;
  employeeRequestPayload: EmployeeRequestPayload;
  positions: Position[] = [];
  divisions: Division[] = [];
  employee: Employee;

  imageUrl = '../../../../../assets/images/default-user-image.png';

  validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
  validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

  errorMatcher = new ErrorMatcher();

  constructor(
    private employeeService: EmployeeService,
    private divisionService: DivisionService,
    private positionService: PositionService,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.basicInfoForm = this.builder.group({
      name: ['', Validators.required],
      positionId: ['', Validators.required],
      subDivisonId: ['', Validators.required],
      contact: this.builder.group({
        email: ['', Validators.required],
        phone: ['', Validators.required],
      }),
      address: ['', Validators.required],
      username: '',
      password: '',
    });

    this.personalInfoForm = this.builder.group({
      familyMember: this.builder.array([]),
      dob: [new Date(2000, 0, 0), Validators.required],
      hireDate: [new Date(), Validators.required],
      gender: ['', Validators.required],
      image: {},
    });

    this.getAllPosition();
    this.getAllDivision();
  }
  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id'] != 0) {
        this.employeeService
          .findEmployeeById(params['id'])
          .subscribe((resp) => {
            this.employee = resp;
            this.basicInfoForm.patchValue({
              ...this.employee,
              positionId: this.employee.position.id,
              subDivisonId: this.employee.subDivision.id,
              username: this.employee?.user?.username,
            });
            this.personalInfoForm.patchValue({
              ...this.employee,
            });
            this.employee.familyMember.forEach((fm) =>
              this.addFamilyMember(fm)
            );
            this.employeeService
              .findEmployeeImageByName(this.employee.image)
              .subscribe((imagePath: string) => {
                this.imageUrl = imagePath;
              });
          });
      }else {
        this.employee = null;
        this.basicInfoForm.reset();
        this.personalInfoForm.reset();
        this.imageUrl = '../../../../../assets/images/default-user-image.png';
      }
      this.cdr.detectChanges();
    });
  }

  addFamilyMember(value?: string) {
    this.familyMember.push(
      this.builder.group({
        member: [value, Validators.required],
      })
    );
  }

  removeFamilyMember(index: number) {
    this.familyMember.removeAt(index);
  }

  get familyMember(): FormArray {
    return this.personalInfoForm.get('familyMember') as FormArray;
  }

  get contact() {
    return this.basicInfoForm.get('contact') as FormGroup;
  }

  ngOnInit(): void {}

  getAllPosition() {
    this.positionService
      .findAllPosition()
      .subscribe((resp) => (this.positions = resp));
  }

  getAllDivision() {
    this.divisionService
      .findAllDivisions()
      .subscribe((resp) => (this.divisions = resp));
  }

  onFileSelect(event: any) {
    const file: File = (event.target as HTMLInputElement).files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    from(file.arrayBuffer())
      .pipe(
        switchMap((buffer: any) => {
          return from(fromBuffer(buffer)).pipe(
            tap((fileTypeResult: FileTypeResult) => {
              if (!fileTypeResult) {
                this.toastr.error('file format not supported!');
              }
              const { ext, mime } = fileTypeResult;
              const isFileTypeLegit = this.validFileExtensions.includes(
                ext as any
              );
              const isMimeTypeLegit = this.validMimeTypes.includes(mime as any);
              const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
              if (!isFileLegit) {
                this.toastr.error('file format does not match file extension!');
              }
              // Set formData into FormGroup
              this.personalInfoForm.get('image').setValue(formData);

              // Update UI with uploaded file
              var reader = new FileReader();
              reader.readAsDataURL(event.target.files[0]);
              reader.onload = (events: any) => {
                this.imageUrl = events.target.result;
              };
            })
          );
        })
      )
      .subscribe();
  }

  save() {
    // Transform into EmployeeRequestPayload
    this.employeeRequestPayload = {
      ...this.basicInfoForm.value,
      ...{
        ...this.personalInfoForm.value,
        familyMember: this.personalInfoForm.value.familyMember.map(
          (m: { member: string }) => {
            return m.member;
          }
        ),
      },
    };

    if (this.employee.id) {
      // Update
      this.employeeService
        .updateEmployee(this.employee.id, this.employeeRequestPayload)
        .subscribe({
          next: (employee: Employee) => {
            this.employeeService
              .uploadEmployeeImage(
                employee.id,
                this.employeeRequestPayload.image
              )
              .subscribe({
                next: () =>
                  this.router.navigateByUrl('/private/employee/employees'),
                error: (err) => this.toastr.error(err.error.message),
              });
          },
          error: (err) => this.toastr.error(err.error.message),
        });
    } else {
      // Add New
      this.employeeService
        .createEmployee(this.employeeRequestPayload)
        .subscribe({
          next: (employee: Employee) => {
            this.employeeService
              .uploadEmployeeImage(
                employee.id,
                this.employeeRequestPayload.image
              )
              .subscribe({
                next: () =>
                  this.router.navigateByUrl('/private/employee/employees'),
                error: (err) => this.toastr.error(err.error.message),
              });
          },
          error: (err) => this.toastr.error(err.error.message),
        });
    }
  }
}
