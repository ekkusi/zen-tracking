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
