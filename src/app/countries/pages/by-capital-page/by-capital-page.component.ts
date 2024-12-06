import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'countries-by-capital-page',
  templateUrl: './by-capital-page.component.html',
  styleUrl: './by-capital-page.component.css'
})
export class ByCapitalPageComponent implements OnInit {

  public countries: Country[] = [];

  public isLoading: boolean = false;

  public initialValue:string ='';

  constructor(private countriesService: CountriesService){}
  ngOnInit(): void {
    this.countries = this.countriesService.cacheStorage.byCapital.countries;
    this.initialValue = this.countriesService.cacheStorage.byCapital.term;
  }

  searchByCapital(term:string){
    this.isLoading = true;
    this.countriesService.searchCapital(term).subscribe(countries => {
      this.countries = countries;
      this.isLoading = false;
    });
  }

}
