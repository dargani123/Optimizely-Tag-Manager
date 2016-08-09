var React = require('react');
var MyInputFields = require('./MyInputFields');

var MySidePanel = React.createClass({

  getInitialState: function() {
    return {
      info: this.props.info,
      fields: this.props.info.fields,
      projectId: "6668600890",
      trackingTrigger: 'inHeader',
      active: 'true',
      tagId: this.props.info._id,
      errors: {}
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.info) {
      this.setState({
        info: nextProps.info,
        fields: nextProps.info.fields
      })
    }
  },

  onUpdate: function() {
    var data = {};
    var errors = {}

    // this.state.tokens.map((token) => {
    //   if (!token.value) {
    //     // Input validation
    //     errors[token.tokenDisplayName] = `${token.tokenDisplayName} is required`;
    //   }
    //   data[token.tokenName] = token.value;
    // })

    data.fields = JSON.stringify(this.state.fields.map(function(field){
      if (! field.value) {
        errors[field.name] = `${field.name} is required`;
      } else {
    	var returnfield = {};
    	returnfield[field.name] = field.value;
    	return returnfield;
      }
    }))
    data.active = this.state.active;
    data.trackingTrigger = this.state.trackingTrigger;
    data.projectId = this.state.projectId;

    if (Object.keys(errors).length === 0) {
      return $.ajax({
        url: '/updatetag/' + this.props.info._id,
        type: 'POST',
        data: data,
        success: function(data) {
          console.log('Update tag successful')},
        error: function(err) {
          console.error("Err posting", err.toString());
        }
      });
    } else {
      this.setState({
        errors: errors
      });
    }
    console.log('errrsssss', this.state.errors)
  },

  onDelete: function() {
    return $.ajax({
      url: '/deletetag/' + this.props.info._id,
      type: 'POST',
      // data: {},
      success: function(data) {
        console.log('delete tag successful')},
      error: function(err) {
        console.error("Err posting", err.toString());
      }
    });
  },

  onChangeTokens: function(field, e) {
    var newState = Object.assign({}, this.state);
    newState.fields[field].value = e.target.value;
    this.setState(newState);
  },

  //this change the enable and triggers
  onChange: function(e) {
    var newState = Object.assign({}, this.state);
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  },

	render: function() {
		if (Object.keys(this.props.info).length !== 0) {
			return (
				<div data-toggle='validator' className="sidepanel background--faint">
			     	<h2 className="push-double--bottom sp-headbig">TAG DETAILS</h2>
			      	<div className="flex">
				    	<div> <img className='sidepanel-logo' src={this.state.info.logo}/> </div>
				    	<div className='flex flex-v-center'>
				      		<div className = 'sidepanel-displayname'> {this.state.info.displayName} </div>
				     	</div>
		        	</div>
		        	<div className='sd-headsmall deschead'> DESCRIPTION </div>
	            	<div className='tagdesc'>{this.state.tagDescription}</div>
	            	<label className="label label--rule">
	            	</label>
			        {this.state.fields.map(function(field, item) {
                var err = this.state.errors[field.name];
			        	return <MyInputFields key={item} error={err || false} field={field} value={this.state.fields[item].value} onChange={this.onChangeTokens.bind(this, item)}/>
			        }.bind(this))}
		            <div className="flex">
		               <div className="flex--1 sd-headsmall"> Called On: </div>
		            </div>
				    <select className="form-control" name='trackingTrigger' value={this.state.trackingTrigger} onChange={this.onChange}>
				      <option value='inHeader'>In header</option>
				      <option value='onPageLoad'>On page load</option>
				    </select>
		            <div className="flex">
		               <div className="flex--1 sd-headsmall"> Enabled or Disabled: </div>
		            </div>
			        <select className="form-control" name='active' value={this.state.active} onChange={this.onChange}>
			          <option value='true'>Enabled</option>
			          <option value='false'>Disabled</option>
			        </select>
				    <div>
				    	<button className="btn-uniform-add button button--highlight" onClick={this.onUpdate}>Update Tag</button>
					</div>
					<div>
						<button className="btn-uniform-del button button--highlight" onClick={this.onDelete}>Delete</button>
			  	</div>
			  </div>
			)
		} else {
			return <div> </div>;
		}
	}
})


module.exports = MySidePanel;