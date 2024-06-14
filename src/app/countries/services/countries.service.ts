import { Injectable } from '@angular/core';
import { Region } from '../interfaces/country.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  // _region: Ningún componente me va a poder modificar la información de Regiones
  private _region: Region[] = [ Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania ];

  constructor() { }

  // Se crea un get para poder acceder a las Regiones
  get regions(): Region[] {
    return [ ...this._region ];  // Esto me saca una copia de _region y rompe el esquema nadia va a poder modificar la info.
  }

}
