import { Component, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'countries-by-country-page',
  templateUrl: './by-country-page.component.html',
  styleUrl: './by-country-page.component.css'
})
export class ByCountryPageComponent implements OnInit {

  public countries: Country[] = [];
  public isLoading: boolean = false;
  public initialValue:string ='';

  constructor(private countriesService: CountriesService){}
  ngOnInit(): void {
    this.countries = this.countriesService.cacheStorage.byCountries.countries;
    this.initialValue = this.countriesService.cacheStorage.byCountries.term;
  }

  searchByCountry(term:string){
    this.isLoading = true;
    this.countriesService.searchName(term).subscribe(countries => {
      this.countries = countries;
      this.isLoading = false;
    });
  }

}
