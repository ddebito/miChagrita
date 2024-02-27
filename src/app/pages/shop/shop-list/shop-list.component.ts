import { Component, OnInit, Pipe } from '@angular/core';
import { ProductService } from '../../product/services/product.service';
import { ProductResponse } from '../../product/models/product-response.interface';
import { componentSettings } from "./shop-list-config";
import { BaseResponse } from '../../../shared/models/base-api-response.interface';
import { CustomTitleService } from '@shared/services/custom-title.service';
import { DateRange, FiltersBox } from '@shared/models/search-options.interface';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { RowClick } from '@shared/models/row-click.interface';

import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss'],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class ShopListComponent implements OnInit {
  
  products : ProductResponse[];
  productsSearch : ProductResponse[];

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent;

  constructor(
    customTitle: CustomTitleService,
    public _productService: ProductService,
    private _spinner: NgxSpinnerService,) { 
      customTitle.set("Tienda");
    }

  component;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    const filters: FiltersBox = {
      searchValue: null,
      searchData: null      
    };

    this.search(filters)
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  ngOnInit(): void {

    this.component = componentSettings;

    this._productService.GetAll((this.pageSize).toString(),
      this.component.initialSort, this.component.initialSort, 0, this.component.getInputs).subscribe( (res:BaseResponse) => {
        console.log(res);
        this.products = res.data;
        this.length = res.totalRecords;
      
    });
  }

  

  setMenu(value: number) {
    this.component.filters.stateFilter = value;
    this.formatGetInputs();
  }

  search(data: FiltersBox) {
    this.component.filters.numFilter = data.searchValue;
    this.component.filters.textFilter = data.searchData;
    this.formatGetInputs();
    
    this._productService.GetAll(
      (this.pageSize).toString(),
      this.component.initialSort,
      this.component.initialSortDir,
      this.pageIndex,
      this.component.getInputs
    ).subscribe((data: BaseResponse) => {
      console.log(data)
      this.products = data.data;
      this._spinner.hide("modal-table");
});
  }

  searchDateRange(date: DateRange) {
    this.component.filters.startDate = date.startDate;
    this.component.filters.endDate = date.endDate;
    this.formatGetInputs();
  }

  resetFilters() {
    this.component.filters = { ...this.component.resetFilters };
    this.formatGetInputs();
  }

  formatGetInputs() {
    let str = "";

    if (this.component.filters.textFilter != null) {
      str += `&numFilter=${this.component.filters.numFilter}&textFilter=${this.component.filters.textFilter}`;
    }

    if (this.component.filters.stateFilter != null) {
      str += `&stateFilter=${this.component.filters.stateFilter}`;
    }

    if (
      this.component.filters.startDate != "" &&
      this.component.filters.endDate != ""
    ) {
      str += `&startDate=${this.component.filters.startDate}`;
      str += `&endDate=${this.component.filters.endDate}`;
    }

    if (this.component.filters.refresh) {
      let random = Math.random();
      str += `&refresh=${random}`;
      this.component.filters.refresh = false;
    }

    this.component.getInputs = str;
  }  
  

  setGetInputsProducts(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `Product?Download=True`;
  }


  rowClick(rowClick: RowClick<ProductResponse>) {
    let action = rowClick.action;
    let product = rowClick.row;

    

    return false;
  }
}



