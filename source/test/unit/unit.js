JS.Test = new JS.Module('Test', {
  extend: {
    Unit: new JS.Module({
      extend: {
        AssertionFailedError: new JS.Class(Error, {
          initialize: function(message) {
            this.message = message.toString();
          }
        })
      }
    }),
    
    asyncTimeout: 10,
    showStack:    true,
    
    filter: function(objects, suffix) {
      return this.Unit.AutoRunner.filter(objects, suffix);
    }
  }
});

