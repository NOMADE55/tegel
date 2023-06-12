import { Component, Host, h, Prop, Event, EventEmitter, Method, Element } from '@stencil/core';
import { State } from '@stencil/core/internal';
import { hasSlot } from '../../utils/utils';

/**
 * @slot banner-header - Slot for the Banner header.
 * @slot banner-subheader - Slot for the Banner subheader.
 * @slot banner-link - Slot for the Banner link section.
 */
@Component({
  tag: 'tds-banner',
  styleUrl: 'banner.scss',
  shadow: true,
})
export class TdsBanner {
  @Element() host: HTMLElement;

  /** Name of the icon for the component. For error and information type, the icon is predefined. */
  @Prop() icon: string;

  /** Header text for the Banner. */
  @Prop() header: string;

  /** Subheader text for the Banner. */
  @Prop() subheader: string;

  /** Type of Banner */
  @Prop() type: 'error' | 'information' | 'none' = 'none';

  /** ID used for internal table functionality and events, must be unique.
   *
   * **NOTE**: If you're listening for Banner close events, you need to set this ID yourself to identify the Banner,
   * as the default ID is random and will be different every time.
   */
  @Prop() bannerId: string = crypto.randomUUID();

  /** Removes the close button on the Banner. */
  @Prop() persistent: boolean = false;

  /** Hides the Banner */
  @Prop({ reflect: true }) hidden = false;

  /* Boolean to check if the slot is being used. */
  @State() hasSubheaderSlot: boolean;

  /* Boolean to check if the slot is being used. */
  @State() hasHeaderSlot: boolean;

  /* Boolean to check if the slot is being used. */
  @State() hasLink: boolean;

  /** Sends a unique Banner identifier when the close button is pressed. */
  @Event({
    eventName: 'tdsClose',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  tdsClose: EventEmitter<{
    bannerId: string;
  }>;

  /** Sends the unique Banner identifier when the close button is pressed. */
  @Event({
    eventName: 'tdsShow',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  tdsShow: EventEmitter<{
    bannerId: string;
  }>;

  /** Hides the Banner. */
  @Method()
  async hideBanner() {
    this.handleClose();
  }

  /** Shows the Banner */
  @Method()
  async showBanner() {
    this.handleShow();
  }

  connectedCallback() {
    if (this.type === 'error') {
      this.icon = 'error';
    } else if (this.type === 'information') {
      this.icon = 'info';
    }
    this.hasHeaderSlot = hasSlot('banner-header', this.host);
    this.hasSubheaderSlot = hasSlot('banner-subheader', this.host);
    this.hasLink = hasSlot('banner-link', this.host);
  }

  handleClose = () => {
    const tdsCloseEvent = this.tdsClose.emit({
      bannerId: this.bannerId,
    });
    if (!tdsCloseEvent.defaultPrevented) {
      this.hidden = true;
    }
  };

  handleShow = () => {
    const tdsCloseEvent = this.tdsShow.emit({
      bannerId: this.bannerId,
    });
    if (!tdsCloseEvent.defaultPrevented) {
      this.hidden = false;
    }
  };

  render() {
    return (
      <Host
        role="banner"
        aria-hidden={`${this.hidden}`}
        aria-live={
          this.host.getAttribute('aria-live') ? this.host.getAttribute('aria-live') : 'polite'
        }
        aria-atomic={this.host.getAttribute('aria-atomic')}
        class={`${this.type} ${this.hidden ? 'hide' : 'show'}`}
      >
        {this.icon && (
          <div class={`banner-icon ${this.type}`}>
            <tds-icon name={this.icon} size="20px"></tds-icon>
          </div>
        )}
        <div class={`banner-content ${this.type} ${!this.icon ? 'no-icon' : ''}`}>
          {(this.header || this.hasHeaderSlot) && (
              <span class={`banner-header`}>
                {this.header}
                <slot name="banner-header"></slot>
              </span>
            ))}
          {(this.hasSubheaderSlot || this.subheader) && (
            <div class="banner-subheader">
              {this.subheader}
              <slot name="banner-subheader"></slot>
            </div>
          )}
          {this.hasLink && (
            <div
              class={`banner-link ${
                !this.hasSubheaderSlot && !this.subheader ? 'no-subheader' : ''
              }`}
            >
              <slot name="banner-link"></slot>
            </div>
          )}
        </div>
        {!this.persistent && (
          <div class={`banner-close`}>
            <button
              onClick={() => {
                this.handleClose();
              }}
            >
              <tds-icon name="cross" size="20px"></tds-icon>
            </button>
          </div>
        )}
      </Host>
    );
  }
}
