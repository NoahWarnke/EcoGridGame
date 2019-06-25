
/**
 * Represents a simple NPC.
 */
 @Component('npc')
export class NPC {
  
  private globalGameState: {totalGames: number, finishedGames: number};
  private entity: IEntity;
  private audioSources: {[index: string]: AudioSource};
  private autoSpeak: boolean;
  
  constructor(transform: Transform, shape: Shape, preWinSound: AudioClip, postWinSound: AudioClip, globalGameState: {totalGames: number, finishedGames: number}) {
    
    this.globalGameState = globalGameState;
    this.autoSpeak = false;
    
    this.entity = new Entity();
    this.entity.addComponent(transform);
    this.entity.addComponent(shape);
    
    let audioSrcs = {
      pre: preWinSound,
      post: postWinSound
    };
    
    // Set up clips, sources, entities for sounds.
    this.audioSources = {};
    for (let srcName in audioSrcs) {
      let entity = new Entity();
      let audioSource = new AudioSource(audioSrcs[srcName]);
      audioSource.playing = false;
      this.audioSources[srcName] = audioSource;
      entity.addComponent(audioSource);
      entity.setParent(this.entity);
    }
    
    this.entity.addComponent(new OnClick(() => {
      this.speak();
      this.faceUser();
    }));
    
    // Self-referential: add this NPC Component to the entity. Bad idea? Maybe.
    //this.entity.addComponent(this);
    
    engine.addEntity(this.entity);
  }
  
  public speak() {
    if (this.globalGameState.totalGames === this.globalGameState.finishedGames) {
      this.audioSources.pre.playing = false; // This doesn't work :(
      this.audioSources.pre.playOnce();
    }
    else {
      this.audioSources.pre.playing = false; // This doesn't work :(
      this.audioSources.pre.playOnce();
    }
  }
  
  public faceUser() {
    let transf = this.entity.getComponent(Transform);
    let diff = Camera.instance.position.subtract(transf.position);
    transf.rotation = Quaternion.Euler(0, Math.atan2(diff.x, diff.z) * 180 / Math.PI, 0);
  }
}
