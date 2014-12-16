function GithubAPI(username){
   // I had the idea to have this grab random repos from a users github account
   // and show it on the users page.
   this.movingX = '';
   this.movingy = '';
   this.firstTimeGettingDirection = false;
   this.requestUrl = 'https://api.github.com/users/' + username + '/repos';
   this.usersRepoArray = [];
   this.userData = {};
   this.getInfo();
};

GithubAPI.prototype.getRepo = function() {
      var max = this.usersRepoArray.length;
      if(!max){
         console.log('no repos');
         return false;
      }
      var min = 0;
      var randomGeneratedNumber = Math.random() * (max - min) + min;
      randomGeneratedNumber = Math.floor(randomGeneratedNumber);
      console.log(this.usersRepoArray[randomGeneratedNumber]);
      return this.usersRepoArray[randomGeneratedNumber];
};

GithubAPI.prototype.getInfo = function() {
   var request = new XMLHttpRequest();
   var GithubThis = this;
   request.onload = function(){
      if(this.status == 200){
         GithubThis.usersRepoArray = JSON.parse(this.response);
         GithubThis.userData = GithubThis.getRepo();
         GithubThis.formBubble();
      }else{
         console.log('Error');
      }
   }
   request.open("get", this.requestUrl, true);
   request.send();
};

GithubAPI.prototype.getDirection = function(){
   this.firstTimeGettingDirection = true;
   var startX = ['left','right'];
   var startY = ['up','down'];
   var randomGeneratedNumber = Math.random() * (2 - 0) + 0;
   randomGeneratedNumber = Math.floor(randomGeneratedNumber);
   this.movingX = startX[randomGeneratedNumber];
   this.movingY = startY[randomGeneratedNumber];

};
GithubAPI.prototype.animateBubble = function (){
   var bubble = $('#gitbub');
   var bubbleOffSet = $('#gitbub').offset();
   var x = bubbleOffSet.left;
   var y = bubbleOffSet.top;
   if(!this.firstTimeGettingDirection){
      this.getDirection();
   }

   if(this.movingX == 'left'){
      if(parseFloat(x - (0.05)) >= 0){
         bubble.animate({'left': parseFloat(x - 0.001) + 'px'});
      }else{
         this.movingX = 'right';
      }
   }else if(this.movingX == 'right'){
      if(parseFloat(x + (0.05)) < 500){
         bubble.css({'left': parseFloat(x + 0.001) + 'px'});
      }else{
         this.movingX = 'left';
      }
   }

   if(this.movingY == 'up'){
      if(parseFloat(y - (0.05)) > 0){
         bubble.animate({'top': parseFloat(x - 0.001) + 'px'});
      }else{
         this.movingY = 'down';
      }
   }else if(this.movingY == 'down'){
      if(parseFloat(y + (0.05)) < 400){
         bubble.animate({'top': parseFloat(x + 0.001) + 'px'});
      }else{
         this.movingY = 'up';
      }
   }

   var github = this;
   setTimeout(function(){
      window.requestAnimationFrame(github.animateBubble.bind(this));
   }.bind(this),1000);
}

GithubAPI.prototype.formBubble = function() {
   if($('.gitbub')){
      var userImage = this.userData.owner.avatar_url;
      var userName = this.userData.owner.login;
      var repoName = this.userData.name;
      var updated = this.userData.updated_at;
      var language = this.userData.language;
      $('.gitbub').html('<img height = "25" width = "25" src=\"' + userImage + '\">' + ' ' + '<h5>' + userName + '</h5>' + '<h5 style="">Repo:' + repoName + '</h5>' + '<h6 style="">Last Update:' + new Date(updated).toDateString() + '</h6>' + '<h5 style="">Language:' + language + '</h5>');
      //window.requestAnimationFrame(this.animateBubble.bind(this));
   }else{
      console.log('You might have forgotten the gitbub element');
   }
};

var test = new GithubAPI('inoabrian');
