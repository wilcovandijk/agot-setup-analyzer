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
        <p>To use this get your deck in text format and paste into the box on the right. Thronesdb's text download option is this format exactly, though I'm sure other editors can provide a similar format</p>
        <p>This tool was made to analyze the setup strength of various decks. After importing your deck it will draw random set up hands (right now 5,000 hands), and determine the best(ish) possible setup and gather stats. Right now it's logic is can probably be better. Truth be told I'm not very good at this game, so any improvements that can be offered is welcome. But the rules this currently uses to determine the <em>best</em> setup from a hand are as followed:</p>
        <ol>
          <li>The set up must have at least 2 characters (not counting dupes). Any possible set up with 1 or 0 characters will not be used if a set up can be made with 2 or more characters</li>
          <li>Total cards used is the next criteria. Any possible set up using more cards then another possible set up will be choose</li>
          <li>Assuming number of cards are tied, a set up using more gold will be used in favor of a set up using less gold</li>
          <li>Assuming used cards and gold are tied total distinct characters used will be the next criteria. Ex. If one possible set up uses 4 cards, 8 gold, and has 3 characters, it will be choosen over one that uses 4 cards, 8 gold, and uses 2 characters.</li>
          <li>If all of that is equal, it will use the possible set up with the most strength on characters</li>
          <li>If it's still tied, then it'll choose one of the tied possible set ups randomly</li>
        </ol>
        <p>This isn't perfect. This logic could probably be improved, but should in general give a good sense of how many cards and gold you can set up on average</p>
        <p>There's also some flat out definite problems with this right now, mostly dealing with attachments. It's at least smart enough to not set up negative attachments, but here's a list of things I'd like to improve/fix soon:</p>
        <ol>
          <li>Attachment restrictions are not followed. If you have a card that can only go on nights watch characters, this will set it up on anyone.</li>
          <li>Specifying cards you don't want to set up. Maybe you don't ever want to set up Varys. For now if you have cards you don't want to set up, replace them in with events before importing</li>
          <li>Mulligans. This doesn't do mulligans, it's just outputting the raw results. I want to add configurable mulligan criteria, and show the final stats after mulligans</li>
          <li>More stats. I'm already tracking but was too lazy to output several more stats, such number of unique characters, how often traits show up, icon spread, etc. If I'm still interested and people think it's useful, I'll add these and more!</li>
        </ol>
        <p>Finally, some credit/shout outs to <a href="http://thronesdb.com/">ThronesDB</a>, where I shameless pulled all card data from and serve images from directly (for now). And to this <a href="https://www.youtube.com/watch?v=gwrEnx84qr4">DobblerTalk on set ups</a> where my rules were inspired from</p>
        <p>Now maybe your wonder how you could ever pay me back, maybe you ran your deck through here and the same set up it showed you was so awful you want to yell at me. Well you can contact me at <a href="mailto:jason@red5dev.com">jason@red5dev.com</a>. As I mentioned I'm pretty new to this game, so I also accept general tips, tricks, decklists and things of that nature.</p>
      </section>
    );
  }
}

export { About };
