// You can copy this as start template to localhost:4000/graphql to start with
// if you update something, update it here

// Would be better if this was a .graphql file, but that messes up graphql-code-generator, so have to do this
const queries = `
query GetUsers {
  getUsers {
    name
  }
}

query GetTransferParticipation {
  getUserTransferParticipation(userName: "ekeukko") {
    challenge {
      name
    }
    markings {
      id
      date
      comment
    }
  }
}

query GetChallenges {
  getChallenges(status: ENDED) {
    ...ChallengeData
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

query GetParticipation{
  getParticipation(challengeId: "5cb8db63-245f-4b68-b3ea-538eb661e9") {
    id
    challenge {
      name
    }
  }
}

query GetParticipations {
  getUserParticipations(userName: "eke")
  {
    id
    challenge {
      id
      name
    }
    user {
      name
    }	
    markings {
      comment
    }
  }
}

mutation EditChallenge {
  updateChallenge(id: "278f192e-f008-4065-88c8-0db8804836b5", args: {name: "NO_PARTICIPATION_MARKINGS_HOLDER"}) {
    name
    id
  }
}

mutation TransferMarkings {
  transferUserMarkings(userName: "eke", challengeId: "abf61797-dbe4-47e2-ad5a-9f337a133554")
}

mutation CreateChallenge {
  createChallenge(challenge: {
    name: "Haaste"
    description: "Joku"
    creatorName: "eke"
    startDate: "2021-02-02"
    endDate: "2021-02-02"
  }) {
    id
    name
    startDate
    endDate
  }
}

mutation Deletes {
  deleteParticipation(challengeId:"abf61797-dbe4-47e2-ad5a-9f337a133554", userName: "")
}

fragment ChallengeData on Challenge {
  id
  name
  status
  startDate
  endDate
  description
}

fragment MarkingData on Marking {
  id
  date
  comment
}
`;
