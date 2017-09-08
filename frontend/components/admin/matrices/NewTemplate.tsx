import * as React from 'react';
import * as R from 'ramda';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, ControlLabel, Form, FormControl, FormGroup, Row } from 'react-bootstrap';
import { actions } from '../../../modules/admin/matrices';
import EditableList from './EditableList';

type NewTemplateComponentProps = {
  actions: typeof actions,
  success: boolean,
  error: ErrorMessage,
};

const FieldGroup = ({ id, label = '', ...props }) =>
  (<FormGroup>
    {label && <ControlLabel>{label}</ControlLabel>}
    <FormControl name={id} {...props} />
  </FormGroup>);

class NewTemplateComponent extends React.Component<NewTemplateComponentProps, { template: UnhydratedTemplate }> {
  constructor(props) {
    super(props);
    this.state = {
      template: {
        name: '',
        id: '',
        version: 1,
        categories: [],
        levels: [],
        skillGroups: [],
      },
    };
    this.updateTemplateState = this.updateTemplateState.bind(this);
    this.onAddTemplate = this.onAddTemplate.bind(this);
  }

  updateTemplateState(e) {
    const field = e.target.name;
    const template = this.state.template;
    template[field] = e.target.value;
    return this.setState({ template });
  }

  onAddTemplate(e) {
    e.preventDefault();
    const skillGroups: UnhydratedSkillGroup[] = [];
    const template = this.state.template;
    R.forEach((category) => {
      R.forEach((level) => {
        skillGroups.push({
          category,
          level,
          skills: [],
        });
      }, template.levels);
    }, template.categories);
    template.skillGroups = skillGroups;
    this.props.actions.addTemplate(template);
    // TODO: Error handling & clearing the form
  }

  render() {
    const { template } = this.state;
    return (
      <div>
        <Row>
          <Form onSubmit={this.onAddTemplate}>
            <FieldGroup
              id="id"
              type="text"
              label="id"
              value={template.id || ''}
              onChange={this.updateTemplateState}
              placeholder="id"
            />
            <FieldGroup
              id="name"
              type="text"
              label="Name"
              value={template.name || ''}
              onChange={this.updateTemplateState}
              placeholder="name"
            />
            <EditableList
              title="Categories"
              placeholder="Category"
              array={template.categories || []}
              onUpdate={categories => this.updateTemplateState({ target: { name: 'categories', value: categories } })}
            />
            <EditableList
              title="Levels"
              placeholder="Level"
              array={template.levels || []}
              onUpdate={levels => this.updateTemplateState({ target: { name: 'levels', value: levels } })}
            />
            <Button bsStyle="primary" type="submit">Add Template</Button>
          </Form>
        </Row>
      </div>);
  }
}

export const NewTemplate = connect(
  state => state.matrices.templateAddResult || {},
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  }),
)(NewTemplateComponent);
