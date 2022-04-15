import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIResponse, Game } from '../model';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getGameList(ordering: string, search?: string):Observable<APIResponse<Game>> {
    let params = new HttpParams()
    .set('ordering', ordering)
    
      if(search) {
        params = new HttpParams()
        .set('ordering', ordering)
        .set('search', search)
      }

      return this.http.get<APIResponse<Game>>(`${environment.BASE_URL}/games`, {
        params: params,
        
      });
  }

  getGameDetails(id: string):Observable<Game>{
    const gameInfoRequest = this.http.get(`${environment.BASE_URL}/games/${id}`);
    const gameTrailerRequest = this.http.get(`${environment.BASE_URL}/games/${id}/movies`);
    const gameScreenshotRequest = this.http.get(`${environment.BASE_URL}/games/${id}/screenshots`);

    return forkJoin({
      gameInfoRequest,
      gameTrailerRequest,
      gameScreenshotRequest
    })
    .pipe(map((res:any) => {
        return{
          ...res['gameInfoRequest'],
          screenshots: res['gameScreenshotRequest']?.results,
          trailers: res['gameTrailerRequest']?.results
        }
    }))
  }


}
