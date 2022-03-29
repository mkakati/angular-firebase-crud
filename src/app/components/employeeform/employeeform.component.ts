import { Component, OnInit } from "@angular/core";
import { City } from "src/models/city";
import { Employee } from "src/models/employee";
import { EmployeeService } from "src/app/services/employee.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: "app-employeeform",
  templateUrl: "./employeeform.component.html",
  styleUrls: ["./employeeform.component.scss"],
})
export class EmployeeformComponent implements OnInit {
  title = "Create";
  employeeId: string;
  employee = new Employee();
  cityList: City[];
  private destroyed$ = new ReplaySubject<void>(1);

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    this.route.paramMap
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params: ParamMap) => {
        this.employeeId = params.get("id");
      });
  }

  ngOnInit() {
    this.employeeService.getCityList().subscribe((data: City[]) => {
      this.cityList = data;
    });

    if (this.employeeId) {
      this.title = "Edit";
      this.employeeService
        .getEmployeeById(this.employeeId)
        .subscribe((result: Employee) => {
          if (result) {
            this.employee = result;
          }
        });
    }
  }

  onEmployeeFormSubmit() {
    if (this.employeeId) {
      this.employeeService
        .updateEmployee(this.employeeId, this.employee)
        .then(() => {
          this.router.navigate(["/"]);
        });
    } else {
      this.employeeService.saveEmployee(this.employee).then(() => {
        this.router.navigate(["/"]);
      });
    }
  }

  exportAsPDF(divId)
    {
         debugger;
        let data = document.getElementById(divId);  
        html2canvas(data).then(canvas => {
        const contentDataURL = canvas.toDataURL('image/png')  // 'image/jpeg' for lower quality output.
        let pdf = new jspdf.jsPDF('l', 'cm', 'a4'); //Generates PDF in landscape mode
        // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
        pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);  
        pdf.save('Filename.pdf');   
      }); 
    }

  cancel() {
    this.router.navigate(["/"]);
  }
}
