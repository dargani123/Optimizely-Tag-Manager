var React = require('react');
import AceEditor from 'react-ace';
var react = require('react-ace');
var Modal = require('react-modal');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    height                : '550px',
    width                 : '700px'
  }
};

var SearchBar = React.createClass({
	  getInitialState: function() {
	    return {
        modalIsOpen: false,
        name: 'custom',
        displayName: null,
        tagDescription: '',
        fields: '',
        template: '',
        trackingTrigger: 'inHeader',
        projectId: "6668600890",
        active: false,
        errors: {}
      };
	  },

	  openModal: function() {
	    this.setState({modalIsOpen: true});
	  },

	  afterOpenModal: function() {
	    // references are now sync'd and can be accessed.
	    this.refs.subtitle.style.color = '#0081BA';
	  },

	  closeModal: function() {
	    this.setState({modalIsOpen: false});
	  },

    addCustomTag: function() {
      var data = {};
      var errors = {}

      data.active = this.state.active;
      data.trackingTrigger = this.state.trackingTrigger;
      data.projectId = this.state.projectId;
      this.setState({modalIsOpen: false});
      data.type = this.state.name;

      if (! this.state.name) {
        errors['displayName'] = 'name is required';
      } else {
        data.displayName = this.state.displayName;
      }

      if (! this.state.tagDescription) {
        errors['tagDescription'] = 'tag description is required';
      } else {
        data.tagDescription = this.state.tagDescription;
      }

      if (! this.state.template) {
        errors['template'] = 'please add a custom tag';
      } else {
        data.template = this.state.template;
      }
      if (Object.keys(errors).length === 0) {
        return $.ajax({
          url: '/' + window.location.search,
          type: 'POST',
          data: data,
          success: function(data) {
            console.log('Add custom tag successful')
          },
          error: function(err) {
            console.error("Err posting", err.toString());
          }
        });
      } else {
        this.setState({
          errors: errors
        });
      }
    },

    onChange: function(e) {
      var newState = Object.assign({}, this.state);
      newState[e.target.name] = e.target.value;
      this.setState(newState);
    },

    onChangeSnippet: function(newVal) {
        this.setState({
          template: newVal
        });
    },

	  render: function() {
      var errorName = (this.state.errors['displayName']) ? 'validation' : '';
      var errorTagDescription = (this.state.errors['tagDescription']) ? 'validation' : '';
      var errorCustom = (this.state.errors['template']) ? 'validation' : '';

	    return (
	    	<div>
	        <ul className="flex push-double--ends">
	          <li className="push-triple--right">
	            <div className="button-group">
	              <div> </div>
	              <div className="search">
	                <input type="text" className="text-input text-input--search width--200" placeholder="Filter by Name"/>
	              </div>
	              <button className="button" type="button">Search</button>
	            </div>
	          </li>
	          <li className="anchor--right">
	            <button className="button button--highlight" onClick={this.openModal}>Create Custom Tag</button>
				    <Modal
				      isOpen={this.state.modalIsOpen}
				      onAfterOpen={this.afterOpenModal}
				      onRequestClose={this.closeModal}
				      style={customStyles} >

				      <h2 ref="subtitle">Create Custom Tag</h2>
				      	<div className='modaltext'>
					      <div> Please create your own tag by inserting Javascript </div>
					      <div className="editor">

					        <AceEditor
					        	className={`editor ${errorCustom}`}
  							    mode="javascript"
  							    theme="tomorrow"
  							    name="template"
  							    height="120px"
  							    width="620px"
  							    editorProps={{$blockScrolling: true}}
                    value={this.state.template}
                    onChange={this.onChangeSnippet}
                  />
                  {(errorCustom) ? <div className='warning'>{this.state.errors['template']}</div> : null }
						  </div>
              <div className="flex">
                     <div className="flex--1 sd-headsmall"> Name</div>
                </div>
                <div className="flex--1"> Please add the name of your snippet. </div>
                <input name='displayName' className={`${errorName}`} value={this.state.displayName} onChange={this.onChange}/>
                {(errorName) ? <div className='warning'>{this.state.errors['displayName']}</div> : null }

                <div className="flex">
				               <div className="flex--1 sd-headsmall"> Description</div>
				          </div>
				          <div className="flex--1"> Please add the description of your tag below. </div>
				          <input name='tagDescription' className={`$(errorTagDescription)`} value={this.state.tagDescription} onChange={this.onChange}/>
                  {(errorTagDescription) ? <div className='warning'>{this.state.errors['tagDescription']}</div> : null }

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
						      <option value='inHeader'>Enabled</option>
						      <option value='onPageLoad'>Disabled</option>
						    </select>
						  </div>
						  <div className='flex space-between'>
							  <button className="button button--highlight" onClick={this.addCustomTag}> Add Custom Tag </button>
						    <button className="button button--highlight" onClick={this.closeModal}> Close </button>
					    </div>
				    </Modal>
	          </li>
	        </ul>
	      </div>
	    )
	  }
});

module.exports = SearchBar;