var $ = require('jquery'),
    Cosmos = require('../../../cosmos.js'),
    renderComponent = require('../../helpers/render-component.js'),
    ComponentPlayground =
      require('../../../components/component-playground.jsx');

describe('ComponentPlayground component', function() {
  var component,
      $component,
      props,
      childProps;

  // Alow tests to extend fixture before rendering
  function render() {
    component = renderComponent(ComponentPlayground, props);
    $component = $(component.getDOMNode());

    if (Cosmos.createElement.callCount) {
      childProps = Cosmos.createElement.lastCall.args[0];
    }
  };

  beforeEach(function() {
    // Don't render any children
    sinon.stub(Cosmos, 'createElement');

    // Allow tests to extend the base fixture
    props = {
      fixtures: {
        MyComponent: {
          'small-size': {
            width: 200,
            height: 100
          }
        }
      },
      fixturePath: 'MyComponent/small-size'
    };
  });

  afterEach(function() {
    Cosmos.createElement.restore();
  })

  describe('children', function() {
    it('should not render child if no fixture is selected', function() {
      delete props.fixturePath;

      render();

      expect(Cosmos.createElement).to.not.have.been.called;
    });

    it('should send down component name to preview child', function() {
      render();

      expect(childProps.component).to.equal('MyComponent');
    });

    it('should send fixture contents to preview child', function() {
      render();

      expect(childProps.width).to.equal(200);
      expect(childProps.height).to.equal(100);
    });

    it('should send (Cosmos) router instance to preview child', function() {
      props.router = {};

      render();

      expect(childProps.router).to.equal(props.router);
    });

    it('should use fixture path as key to preview child', function() {
      render();

      expect(childProps.key).to.equal(props.fixturePath);
    });

    it('should clone fixture contents sent to child', function() {
      var obj = {};
      props.fixtures.MyComponent['small-size'].shouldBeCloned = obj;

      render();

      expect(childProps.shouldBeCloned).to.not.equal(obj);
    })
  });
});