import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {
  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }
  private _tagsHistory: string[] = [];
  // Variables para ejecución deL servicio de GIPHY.
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';
  private apiKey: string = 'erJ8BL22YkOJ4CPeW1qkn4BGdXNF7jGE';

  public gifsList: Gif[] = [];

  get tagsHistory() {
    return [...this._tagsHistory];
  }
  /**
   * Función encargada de administrar busqueda de gifs.
   * @param {String} tag
  */
  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter(oldTag => oldTag !== tag);
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }
  /**
   * Función para guardar en local storage del navegador el historial actualizado.
  */
  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }
  /**
   * Función para verificar y cargar data de historial guardado en local storage.
  */
  private loadLocalStorage(): void {
    let lastHistory: string | null = localStorage.getItem('history');
    let lastSearch: string;

    if (!lastHistory) return;
    this._tagsHistory = JSON.parse(lastHistory);
    if (this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }
  /**
   * Función para la busqueda de gifs a través de servicio de GIPHY.
   * @param {String} tag
  */
  public searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag);

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe(resp => {
        this.gifsList = resp.data;
        console.log({ gifs: this.gifsList });
      });
  }
}
