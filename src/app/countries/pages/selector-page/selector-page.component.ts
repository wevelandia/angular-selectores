import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrl: './selector-page.component.css'
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];

  public myForm: FormGroup = this.fb.group({
    region: [ '', Validators.required ],
    country: [ '', Validators.required ],
    border: [ '', Validators.required ]
  })

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {

    this.onRegionChanged();
    this.onCountryChanged();

  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChanged(): void {
    // Debemos definir un Listener para saber cuando se ha cambiado de Region.
    // switchMap: Me permite recibie el Observable y pasarlo a otro observable
     /* En el caso del switchMap si tenemos un argumento y este se envia igualmente
     al observable se puede dejar la linea así: switchMap( this.countriesService.getCountriesByRegion ) */
    // El tap que definimos aca es para que cuando se cambie de Region el país quede vacio para que salga la primera opción (-- Seleccione un País).
    // switchMap : Aca estamos pidiendo los paises.
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap( () => this.myForm.get('country')!.setValue('') ),
        switchMap( region => this.countriesService.getCountriesByRegion(region) )
      )
      .subscribe( countries => {
        //console.log({ countries });
        this.countriesByRegion = countries;
      });
  }

  onCountryChanged(): void {

    //filter: Otro operador de rxjs si value.length > 0 continua sino se sale.
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap( () => this.myForm.get('border')!.setValue('') ),
        tap( () => this.borders = [] ),
        filter( (value: string) => value.length > 0 ),
        switchMap( (alpahCode) => this.countriesService.getCountryByAlphaCode(alpahCode) ),
        switchMap( (country) => this.countriesService.getCountriesBordersByCodes( country.borders ) )
      )
      .subscribe( countries => {
        console.log({ countries });
        this.borders = countries;
      });

  }

}
