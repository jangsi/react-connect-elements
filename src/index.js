import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Portal from './portal';
import { connectElements } from './utils';

export default class ReactConnectElements extends PureComponent {
  static propTypes = {
    elements: PropTypes.array.isRequired,
    overlay: PropTypes.number,
    selector: PropTypes.string.isRequired,
    useId: PropTypes.bool, // if selectors are ids
    strokeWidth: PropTypes.number,
    color: PropTypes.string,
  };

  static defaultProps = {
    overlay: 0,
    strokeWidth: 5,
    color: '#666',
  };

  state = {
    querySelector: 'body',
  };

  componentDidMount() {
    this.checkSelector();
  }

  checkSelector = () => {
    if (document.querySelector(this.props.selector)) {
      this.setState({ querySelector: this.props.selector }, () =>
        this.connectAll()
      );
    }
  };

  connectAll = () => {
    const { elements, useId } = this.props;

    elements.map((element, index) => {
      if (useId) {
        const start = document.getElementById(element.from);
        const end = document.getElementById(element.to);
        const path = document.querySelector(`#path${index + 1}`);

        return connectElements(this.svgContainer, this.svg, path, start, end);
      } else {
        const start = document.querySelector(element.from);
        const end = document.querySelector(element.to);
        const path = document.querySelector(`#path${index + 1}`);

        return connectElements(this.svgContainer, this.svg, path, start, end);
      }
    });
  };

  render() {
    const { elements, overlay, strokeWidth, color } = this.props;

    return (
      this.state.querySelector && (
        <Portal query={this.state.querySelector}>
          <div
            id="react-connect-elements-container"
            style={{ zIndex: overlay, position: 'absolute' }}
            ref={svg => {
              this.svgContainer = svg;
            }}
          >
            <svg
              width="0"
              height="0"
              ref={svg => {
                this.svg = svg;
              }}
            >
              {elements.map((element, index) => (
                element.isLeft ? (
                  <path
                    key={`${element.from}-${element.to}`}
                    id={`path${index + 1}`}
                    d="M0 0"
                    stroke={element.color || color}
                    fill="none"
                    strokeWidth={`${strokeWidth}px`}
                    strokeDasharray='10,10'
                  />
                ) : (
                  <path
                    key={`${element.from}-${element.to}`}
                    id={`path${index + 1}`}
                    d="M0 0"
                    stroke={element.color || color}
                    fill="none"
                    strokeWidth={`${strokeWidth}px`}
                  />
                )
              ))}
            </svg>
          </div>
        </Portal>
      )
    );
  }
}
