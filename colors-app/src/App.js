import React, { Component } from "react";
import Pallete from "./Palette";
import seedColors from "./seedColor";
import { generatePalette } from "./colorHelpers";
import { Route, Switch } from "react-router-dom";
import PaletteList from "./PaletteList";
import SingleColorPalette from "./SingleColorPalette";
import NewPaletteForm from "./NewPaletteForm";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Page from "./Page";
export default class App extends Component {
  constructor(props) {
    super(props);
    const savedPalettes = JSON.parse(window.localStorage.getItem("palettes"));
    this.state = { palettes: savedPalettes || seedColors };
    this.findPalette = this.findPalette.bind(this);
    this.savePalette = this.savePalette.bind(this);
    this.syncLocalStorage = this.syncLocalStorage.bind(this);
    this.deletePalette = this.deletePalette.bind(this);
  }
  findPalette(id) {
    return this.state.palettes.find((palette) => palette.id === id);
  }
  savePalette(newPalette) {
    this.setState(
      { palettes: [...this.state.palettes, newPalette] },
      this.syncLocalStorage
    );
  }
  deletePalette(id) {
    this.setState(
      {
        palettes: this.state.palettes.filter((palette) => palette.id !== id),
      },
      this.syncLocalStorage
    );
  }
  syncLocalStorage() {
    window.localStorage.setItem(
      "palettes",
      JSON.stringify(this.state.palettes)
    );
  }
  render() {
    const { palettes } = this.state;
    return (
      <Route
        render={({ location }) => (
          <TransitionGroup>
            <CSSTransition key={location.key} classNames="page" timeout={500}>
              <Switch location={location}>
                <Route
                  exact
                  path="/palette/new"
                  render={(routeProps) => (
                    <Page>
                      <NewPaletteForm
                        {...routeProps}
                        savePalette={this.savePalette}
                        palettes={palettes}
                      />
                    </Page>
                  )}
                />
                <Route
                  exact
                  path="/"
                  render={(routeProps) => (
                    <Page>
                      <PaletteList
                        palettes={palettes}
                        {...routeProps}
                        deletePalette={this.deletePalette}
                      />
                    </Page>
                  )}
                />
                <Route
                  exact
                  path="/palette/:id"
                  render={(routeProps) => (
                    <Page>
                      <Pallete
                        palette={generatePalette(
                          this.findPalette(routeProps.match.params.id)
                        )}
                      />
                    </Page>
                  )}
                />
                <Route
                  exact
                  path="/palette/:paletteId/:colorId"
                  render={(routeProps) => (
                    <Page>
                      <SingleColorPalette
                        colorId={routeProps.match.params.colorId}
                        palette={generatePalette(
                          this.findPalette(routeProps.match.params.paletteId)
                        )}
                      />
                    </Page>
                  )}
                />
                <Route
                  render={(routeProps) => (
                    <Page>
                      <PaletteList
                        palettes={palettes}
                        {...routeProps}
                        deletePalette={this.deletePalette}
                      />
                    </Page>
                  )}
                />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        )}
      />
    );
  }
}
