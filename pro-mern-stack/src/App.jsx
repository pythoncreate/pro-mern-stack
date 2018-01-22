const contentNode = document.getElementById('contents');

class IssueFilter extends React.Component {
  render() {
    return (
      <div>This is a placeholder for the Issue Filter.</div>
    )
  }
}

//any component without state should be written as a function rather than classes---still takes in props
const IssueRow = (props) => (
      <tr>
        <td>{props.issue.id}</td>
        <td>{props.issue.status}</td>
        <td>{props.issue.owner}</td>
        <td>{props.issue.created.toDateString()}</td>
        <td>{props.issue.effort}</td>
        <td>{props.issue.completionDate ? props.issue.completionDate.toDateString() : ''}</td>
        <td>{props.issue.title}</td>
      </tr>
    )

//we need a full function here (not ES6) since we it is not a single expression--and we need a return value
function IssueTable (props) {
    const issueRows = props.issues.map(issue => <IssueRow key={issue.id} issue={issue} />)
    return (
      <table className="bordered-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Created</th>
            <th>Effort</th>
            <th>Completion Date</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>{issueRows}</tbody>
      </table>
    );
  }

class IssueAdd extends React.Component {
  constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
  }  

  handleSubmit(e) {
      e.preventDefault();
      var form = document.forms.issueAdd;
      this.props.createIssue({
          owner: form.owner.value,
          title: form.title.value,
          status: 'New',
          created: new Date(),
      });
      //clear the form for next input
      form.owner.value = ""; form.title.value = "";
  }

  render() {
    return (
      <div>
          <form name="issueAdd" onSubmit={this.handleSubmit}>
            <input type="text" name="owner" placeholder="Owner" />
            <input type="text" name="title" placeholder="Title" />
            <button>Add</button>
          </form>
      </div>
    )
  }
}

class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    //we must bind here since its being called from another component--so we have access to 'this'
    this.createIssue = this.createIssue.bind(this);
  }

  componentWillMount() {
    this.loadData();
  }

  loadData() {
     fetch('/api/issues').then(response =>
        response.json() 
    ).then(data => {
        console.log("Total count of records:", data._metadata.total_count);
        data.records.forEach(issue => {
            issue.created = new Date(issue.created);
            if (issue.completionDate)
              issue.completionDate = new Date(issue.completionDate);
        });
        this.setState({ issues: data.records });
    }).catch(err => {
        console.log(err);
    })
  }

  createIssue(newIssue) {
    //this just makes a copy of issues array
    const newIssues = this.state.issues.slice();
    //sets id of new issue
    newIssue.id = this.state.issues.length + 1;
    //push new issue to the newIssues array
    newIssues.push(newIssue);
    //update the state
    this.setState({ issues: newIssues });
  }


  render() {
    return (
      <div>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={this.state.issues} />
        <hr />
        <IssueAdd createIssue={this.createIssue}/>
      </div>
    );
  }
}

ReactDOM.render(<IssueList />, contentNode);    // Render the component inside the content Node