import { Pipe, PipeTransform } from "@angular/core";
import { Slayer, Blade, Gunslinger, Arcanist, Tactician } from "../../../../server/src/SlayerRoomState";

@Pipe({
    name: 'asBlade',
    pure: true
  })
  export class BladePipe implements PipeTransform {  
    transform(value: Slayer, args?: any): Blade {
      return value as Blade;
    }
  }
  @Pipe({
    name: 'asGunslinger',
    pure: true
  })
  export class GunslingerPipe implements PipeTransform {  
    transform(value: Slayer, args?: any): Gunslinger {
      return value as Gunslinger;
    }
  }
  @Pipe({
    name: 'asArcanist',
    pure: true
  })
  export class ArcanistPipe implements PipeTransform {  
    transform(value: Slayer, args?: any): Arcanist {
      return value as Arcanist;
    }
  }
  @Pipe({
    name: 'asTactician',
    pure: true
  })
  export class TacticianPipe implements PipeTransform {  
    transform(value: Slayer, args?: any): Tactician {
      return value as Tactician;
    }
  }