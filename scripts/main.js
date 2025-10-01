const root = document.getElementById('root');

class NanoType {
    constructor(displayText){
        this.displayText = displayText;
        this.inputText = '';
        this.startedAt = null;
        this.wpm = 0;
        this.wordsPerWord = 5;
        this.accuracy = 100;
    }
    start(){
        if(this.startedAt) return;
        this.startedAt = new Date();
    }
    reset(newText){
        this.targetText = newText;
        this.inputText = '';
        this.startedAt = null;
        this.isFinished = false;
        this.wpm = 0;
        this.accuracy = 100;
    }

    setInput(input) {
        if(!this.startedAt) {
          this.start();
        }
        this.inputText = input;
    }

    calculateStats(){
        let correct = 0;
        let error = 0;
        for(let i=0;i<this.inputText.length;i++) {
          if(this.targetText[i] === this.inputText[i]) correct++; 
          else error++;
        }
        const now = Date.now();
        const TimeTaken = this.startedAt ? now - this.startedAt : 1; //mili
        const TimeTakenMin = TimeTaken / 60000;
        const totalWordsTyped = correct / this.wordsPerWord;
        this.wpm = totalWordsTyped / TimeTakenMin;
        this.accuracy = this.inputText.length == 0 ? 100 : (correct / this.inputText.length) * 100;
    }

    getState(){
        const states = [];
        for(let i=0;i<this.targetText.length;i++) {
          if(i < this.inputText.length) {
            states.push(this.inputText[i] == this.targetText[i] ? 'correct' : 'wrong');
          } else if(i === this.inputText.length) {
            states.push('current');
          } else {
            states.push('pending');
          }
        }
        return states;
    }
}


function pickRandomText() {
    return texts[Math.floor(Math.random() * texts.length)];
}

