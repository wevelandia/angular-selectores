import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Country, Region, SmallCountry } from '../interfaces/country.interfaces';
import { Observable, combineLatest, map, of, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.com/v3.1';

  // _region: Ningún componente me va a poder modificar la información de Regiones
  private _regions: Region[] = [ Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania ];


  constructor(
    private http: HttpClient
  ) { }

  // Se crea un get para poder acceder a las Regiones
  get regions(): Region[] {
    return [ ...this._regions ];  // Esto me saca una copia de _region y rompe el esquema nadia va a poder modificar la info.
  }

  getCountriesByRegion( region: Region ): Observable<SmallCountry[]> {

    // Para que las peticiones me funcionen a este nivel se debio importarl el modulo de HttpClientModule en app.module
    if ( !region ) return of([]);

    const url: string = `${ this.baseUrl }/region/${ region }?fields=cca3,name,borders`;

    // map: aca realizamos la conversión de los que recibimos a SmallCountry.
    // countries.map: aca map es la función para arreglos
    // ?? : Es un operador de covalencia nula.
    return this.http.get<Country[]>(url)
      .pipe(
        map( countries => countries.map( country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? []
        } ) ) )
        //tap( response => console.log({ response }) )
      );

  }

  getCountryByAlphaCode( alphaCode: string ): Observable<SmallCountry> {

    const url = `${ this.baseUrl }/alpha/${ alphaCode }?fields=cca3,name,borders`;

    return this.http.get<Country>( url )
    .pipe(
      map( country => ({
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders ?? []
      } ) ) );
  }

  getCountriesBordersByCodes( borders: string[] ): Observable<SmallCountry[]> {

    if ( !borders || borders.length === 0 ) return of([]);

    const countriesRequest: Observable<SmallCountry>[] = [];

    borders.forEach( code => {
      const request = this.getCountryByAlphaCode( code );

      countriesRequest.push( request );

    } );

    //combineLatest: Esta función de rxjs nos permite recibir un conjunto de observables nos emite hasta que todos los observables emitan un valor.
    return combineLatest( countriesRequest );

  }

}
