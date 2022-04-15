import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/model';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {

  gameRating = 0;
  gameId!: string;
  game!: Game;
  routeSub!: Subscription;
  gameSub!: Subscription;


  gaugeType = "full";
  gaugeLabel = "Metacritic";  
  color ="rgba(0, 150, 14, 1)";

  constructor(private activatedRoute: ActivatedRoute,
    private httpService: HttpService) { }

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      this.gameId = params['id'];
      this.getGameDetails(this.gameId);      
    })
    
  }

  getGameDetails(id:string){
    this.gameSub = this.httpService.getGameDetails(id).subscribe((gameResp: Game) => {
      this.game = gameResp;
 
      setTimeout(() => {
          this.gameRating = this.game.metacritic;
      }, 1000)
    })
  }


  getColor(value: number) {
    if(value > 75) {
      return '#5ee432'
    }
    else if(value > 50) {
      return '#fffa50'
    } else if(value > 30) {
      return '#f71138'
    }
    else {
      return '#ef4655'
    }
   }

   ngOnDestroy(): void {
     if(this.gameSub) {
       this.gameSub.unsubscribe();
     }
   }

}
