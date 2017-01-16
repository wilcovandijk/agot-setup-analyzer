/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>

interface IAboutProps {
}

interface IAboutState {
}

class About extends React.Component<IAboutProps, IAboutState> {

  public state : ICardItemState;

  constructor(props : IAboutProps){
    super(props);
  }

  public shouldComponentUpdate(nextProps : ICardItemProps, nextState : ICardItemState) {
    return false;
  }


  public render() {
    return (
      <section className="about">
        <h2>Now copy paste decks directly from ThronesDB! Just select and copy the decklist directly from either the edit or view screen</h2>
        <h3>Latest Full Pack: Ghosts of Harrenhal</h3>
        <p>To use this get your deck in text format and paste into the box on the right. Thronesdb's text download option is this format exactly, though I'm sure other editors can provide a similar format</p>
        <p>This tool was made to analyze the setup strength of various decks. After importing your deck it will draw random set up hands (right now 5,000 hands), and determine the best(ish) possible setup and gather stats. Right now it's logic is can probably be better. There are settings for determining hand quality and mulligans which can be found on the "Configure" tab after importing. The rules this currently uses to determine the <em>best</em> setup from a hand are as followed: </p>
        <ol>
          <li>The set up must have at least 2 characters (not counting dupes). Any possible set up with 1 or 0 characters will not be used if a set up can be made with 2 or more characters. This is configurable on the "Configure" tab</li>
          <li>Total cards used is the next criteria. Any possible set up using more cards then another possible set up will be choose. Characters with enter play affects will ony be used if there is nothing else to use the gold on</li>
          <li>Assuming number of cards are tied, a set up using more gold will be used in favor of a set up using less gold. Incoming providing card are considered as "extra gold" for this determination</li>
          <li>If it is still tied, setup hands that use a limited card will be prioritized</li>
          <li>Assuming used cards and gold are tied total distinct characters used will be the next criteria. Ex. If one possible set up uses 4 cards, 8 gold, and has 3 characters, it will be choosen over one that uses 4 cards, 8 gold, and uses 2 characters.</li>
          <li>If all of that is equal, it will use the possible set up with the most strength on characters</li>
          <li>If it's still tied, then it'll choose one of the tied possible set ups randomly</li>
          <li>This will also perform mulligans if cards do not meet minimum card requirements. You can configure when to mulligan in the "Configure" tab</li>
        </ol>

        <h2>Wardens of the Golden Gate</h2>
        <p>I recently started a YouTube channel from our local meta. <a href="https://www.youtube.com/channel/UCuiQd1d6TXY-Az59-1tqY_w/featured">Check it out!</a> Here is a recent video!</p>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=PLVL91rSgTFRKfpXe9m01kQKuL0cSXam9-" frameBorder="0" allowFullScreen></iframe>        <p>Finally, some credit/shout outs to resources I used to make this, or resources I find valuable:</p>
        <ol>
          <li><a href="http://thronesdb.com/">ThronesDB</a>, where I shameless pulled all card data from and serve images from directly</li>
          <li><a href="http://agotannals.com/">The Annals</a> where I go to find recent tournament results to find which deck to build or build against</li>
          <li><a href="http://www.cardgamedb.com/index.php/podcasts/_/game-of-thrones-beyond-the-wall/">Beyond the Wall</a> and <a href="http://www.whitebookpodcast.com/">The White Book Podcast</a></li>
          <li>This <a href="https://www.youtube.com/watch?v=gwrEnx84qr4">DobblerTalk on set ups</a> where my rules were inspired from</li>
        </ol>
        <p>Now maybe your wonder how you could ever pay me back, maybe you ran your deck through here and the same set up it showed you was so awful you want to yell at me. Well you can contact me at <a href="mailto:jason@red5dev.com">jason@red5dev.com</a>. As I mentioned I'm pretty new to this game, so I also accept general tips, tricks, decklists and things of that nature.</p>
      </section>
    );
  }
}

export { About };
