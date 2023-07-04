import React from 'react';
import './App.css';

const Sentiment = require('sentiment');
const analyzer = new Sentiment();

class App extends React.Component<{}, { text: string, score: number, tokens: Map<string, number> }> {
    constructor(props: any) {
        super(props);
        this.state = {
            text: "",
            score: 0,
            tokens: new Map<string, number>(),
        }
    }

    onTextChange = (event: any) => {
        const newText = event.target.value;
        const result = analyzer.analyze(newText);
        const score = result.comparative;

        const tokens = new Map<string, number>();
        for (const i in result.calculation) {
            const calc = result.calculation[i];
            tokens.set(Object.keys(calc)[0], parseFloat(Object.values(calc)[0] as string))
        }
        event.target.rows = newText.includes("\n") ? 5 : 1;

        this.setState({text: newText, score: score, tokens: tokens});

        if (newText.trim().length < 1) {
            event.target.style.borderColor = `hsl(0, 0%, 50%)`;
            return;
        }
        let hue = Math.min(Math.max((Math.max(-1, Math.min(1, score)) + 1) / 2 * 120, 0), 120);
        event.target.style.borderColor = `hsl(${hue.toString()}, 100%, 50%)`;
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1>Disney Kids: NLP Sentiment Analyzer</h1>
                    <p>
                        <code>{this.state.score < 0 ? "Negative" : (this.state.score > 0 ? "Positive" : "Neutral")} ({this.state.score})</code>
                    </p>
                    <div className="App-container">
                        <textarea
                            onChange={this.onTextChange}
                            className="App-input"
                            placeholder="Enter some text"
                            value={this.state.text}
                            rows={1}
                        />
                    </div>
                    {
                        this.state.tokens.size > 0 ? <p>
                            Tokens:<br />
                            {
                                Array.from(this.state.tokens).map(([key, value]) => {
                                    return (<span><code>{key}: {value}</code><br/></span>);
                                })
                            }
                        </p> : <div/>
                    }
                </header>
            </div>
        );
    }
}

export default App;
