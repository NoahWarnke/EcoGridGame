
/**
 * Represents a simple NPC.
 */
 @Component('npc')
export class NPC {
  
  private globalGameState: {totalGames: number, finishedGames: number};
  private entity: IEntity;
  private preWinSound: AudioClip;
  private postWinSound: AudioClip;
  
  constructor(transform: Transform, shape: Shape, preWinSound: AudioClip, postWinSound: AudioClip, globalGameState: {totalGames: number, finishedGames: number}) {
    
    this.globalGameState = globalGameState;
    this.preWinSound = preWinSound;
    this.postWinSound = postWinSound;
    
    this.entity = new Entity();
    this.entity.addComponent(transform);
    this.entity.addComponent(shape);
    
    this.entity.addComponent(new OnClick(() => {
      if (this.globalGameState.totalGames === this.globalGameState.finishedGames) {
        try {
          log('trying to remove old source...');
          let oldSource = this.entity.getComponent(AudioSource);
          this.entity.removeComponent(oldSource);
          log('old source removed.');
        }
        catch(e) {}
        let src = new AudioSource(this.postWinSound);
        src.playing = false;
        this.entity.addComponent(src);
        log('play post once!');
        src.playOnce();
      }
      else {
        try {
          log('trying to remove old source...');
          let oldSource = this.entity.getComponent(AudioSource);
          this.entity.removeComponent(oldSource);
          log('old source removed...');
        }
        catch(e) {}
        let src = new AudioSource(this.preWinSound);
        src.playing = false;
        this.entity.addComponent(src);
        log('play pre once!');
        src.playOnce();
      }
    }));
    
    // Self-referential: add this NPC Component to the entity. Bad idea? Maybe.
    //this.entity.addComponent(this);
    
    engine.addEntity(this.entity);
  }
}
