import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private apiUrl: string = "https://restcountries.com/v3.1";
  public cacheStorage: CacheStore = {
    byCapital: {term:'', countries: []},
    byCountries: {term:'', countries: []},
    byRegion: {region:'', countries: []}
  };

  constructor(private http: HttpClient){
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage(){
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStorage));
  }

  private loadFromLocalStorage(){
    if(!localStorage.getItem('cacheStore')) return;

    this.cacheStorage = JSON.parse(localStorage.getItem('cacheStore')!);
  }

  private getCountriesRequest(url: string): Observable<Country[]>{
    return this.http.get<Country[]>(url).pipe(
      catchError(() => of([]))
    );
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null>{
    return this.http.get<Country[]>(`${this.apiUrl}/alpha/${code}`).pipe(
      map(countries => countries.length > 0 ? countries[0] : null),
      catchError(() => of(null))
    );
  }

  searchCapital(term: string): Observable<Country[]>{
    return this.getCountriesRequest(`${this.apiUrl}/capital/${term}`)
    .pipe(
      tap(countries => this.cacheStorage.byCapital = {term, countries}),
      tap(() => this.saveToLocalStorage())
    );
  }

  searchName(term: string): Observable<Country[]>{
    return this.getCountriesRequest(`${this.apiUrl}/name/${term}`)
    .pipe(
      tap(countries => this.cacheStorage.byCountries = {term, countries}),
      tap(() => this.saveToLocalStorage())
    );
  }

  searchRegion(region: Region): Observable<Country[]>{
    return this.getCountriesRequest(`${this.apiUrl}/region/${region}`)
    .pipe(
      tap(countries => this.cacheStorage.byRegion = {region, countries}),
      tap(() => this.saveToLocalStorage())
    );
  }
}
