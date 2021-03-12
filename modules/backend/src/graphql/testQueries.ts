// You can copy this as start template to localhost:4000/graphql to start with
// if you update something, update it here

// Would be better if this was a .graphql file, but that messes up graphql-code-generator, so have to do this
const queries = `
query GetUsers {
  getUsers {
    ...UserData
    participations {
  		id
      markings {
        ...MarkingData
      }
    }
  }
}

query GetChallenges {
  getChallenges {
    ...ChallengeData
    creator {
      ...UserData
    }
    participations {
      id
      user {
        name
      }
      markings {
        ...MarkingData
      }
    }
  }
}

mutation Deletes {
  deleteParticipation(id: "b33687e8-e171-4b42-abe8-e4758a019b33")
}

fragment ChallengeData on Challenge {
  id
  name
  description
  creator {
    name
  }
  status
  startDate
  endDate
}

fragment UserData on User {
  name
  isPrivate
}

fragment MarkingData on Marking {
  id
  date
  comment
}
`;
