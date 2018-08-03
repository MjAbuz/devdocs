/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Cls = (app.views.Document = class Document extends app.View {
  constructor(...args) {
    {
      // Hack: trick Babel/TypeScript into allowing this before super.
      if (false) { super(); }
      let thisFn = (() => { return this; }).toString();
      let thisName = thisFn.slice(thisFn.indexOf('return') + 6 + 1, thisFn.indexOf(';')).trim();
      eval(`${thisName} = this;`);
    }
    this.afterRoute = this.afterRoute.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    super(...args);
  }

  static initClass() {
    this.el = document;
  
    this.events =
      {visibilitychange: 'onVisibilityChange'};
  
    this.shortcuts = {
      help:        'onHelp',
      preferences: 'onPreferences',
      escape:      'onEscape',
      superLeft:   'onBack',
      superRight:  'onForward'
    };
  
    this.routes =
      {after: 'afterRoute'};
  }

  init() {
    this.addSubview((this.menu    = new app.views.Menu),
    this.addSubview(this.sidebar = new app.views.Sidebar));
    if (app.views.Resizer.isSupported()) { this.addSubview(this.resizer = new app.views.Resizer); }
    this.addSubview(this.content = new app.views.Content);
    if (!app.isSingleDoc() && !app.isMobile()) { this.addSubview(this.path    = new app.views.Path); }
    if (!app.isSingleDoc()) { this.settings = new app.views.Settings; }

    $.on(document.body, 'click', this.onClick);

    this.activate();
  }

  setTitle(title) {
    return this.el.title = title ? `${title} — DevDocs` : 'DevDocs API Documentation';
  }

  afterRoute(route) {
    if (route === 'settings') {
      if (this.settings != null) {
        this.settings.activate();
      }
    } else {
      if (this.settings != null) {
        this.settings.deactivate();
      }
    }
  }

  onVisibilityChange() {
    if (this.el.visibilityState !== 'visible') { return; }
    this.delay(function() {
      if (app.isMobile() !== app.views.Mobile.detect()) { location.reload(); }
    }
    , 300);
  }

  onHelp() {
    app.router.show('/help#shortcuts');
  }

  onPreferences() {
    app.router.show('/settings');
  }

  onEscape() {
    const path = !app.isSingleDoc() || (location.pathname === app.doc.fullPath()) ?
      '/'
    :
      app.doc.fullPath();

    app.router.show(path);
  }

  onBack() {
    history.back();
  }

  onForward() {
    history.forward();
  }

  onClick(event) {
    const target = $.eventTarget(event);
    if (!target.hasAttribute('data-behavior')) { return; }
    $.stopEvent(event);
    switch (target.getAttribute('data-behavior')) {
      case 'back':         history.back(); break;
      case 'reload':       window.location.reload(); break;
      case 'reboot':       window.location = '/'; break;
      case 'hard-reload':  app.reload(); break;
      case 'reset':        if (confirm('Are you sure you want to reset DevDocs?')) { app.reset(); } break;
    }
  }
});
Cls.initClass();