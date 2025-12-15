# Project Management

## Linear Integration

This project is tracked in Linear for issue management and project tracking.

**Project**: [DOBEU Digital Wharf Dynamics](https://linear.app/dobeutechsolutions/project/dobeu-digital-wharf-dynamics-45c1d275de23)  
**Team**: Dobeu Tech Solutions (DTS)  
**Project ID**: `5f406bd2-8023-4718-96b8-d78bb8e5c5d5`

## Workflow

### Stop Points

At each development stop point, update Linear with:

1. Completed work (create/update issues)
2. Current progress status
3. Implementation details
4. Related changes

### Before Commits

1. Update Linear issues with completed work
2. Run ESLint: `npm run lint`
3. Fix any linting issues
4. Update documentation if needed
5. Commit changes: `git commit -m "description"`
6. Push to remote: `git push origin <branch>`

## Issue Management

### Creating Issues

Issues should be created for:

- New features
- Bug fixes
- Refactoring work
- Documentation updates
- Technical debt

### Issue Labels

Use appropriate labels:

- `feature` - New functionality
- `bug` - Bug fixes
- `refactor` - Code improvements
- `docs` - Documentation
- `chore` - Maintenance tasks

### Issue Priorities

- **Urgent (1)**: Critical bugs, security issues
- **High (2)**: Important features, significant bugs
- **Normal (3)**: Standard features, improvements
- **Low (4)**: Nice-to-have features, minor improvements

## Project Status

Track project status in Linear:

- **Backlog**: Planned but not started
- **In Progress**: Currently being worked on
- **In Review**: Completed, awaiting review
- **Done**: Completed and verified

## Automation

The development workflow includes:

- Automatic Linear updates at stop points
- Issue creation for major changes
- Status updates on completion
- Documentation linking

See `docs/linear-workflow.md` for detailed workflow information.
