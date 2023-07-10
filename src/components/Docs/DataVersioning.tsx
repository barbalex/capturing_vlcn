import { Container } from './ImageLayerTypes'

export const DataVersioning = () => (
  <Container>
    <h1>Data Versioning</h1>

    <p>Also known as: conflict-capable data structure.</p>
    <p>This is a bit technical. You have been warned 😉.</p>
    <p>
      But as you entrust us your data, we owe you a good explanation of what
      happens with it.
    </p>

    <h3>1. The problem</h3>
    <p>Let&apos;s assume an app lets users edit offline:</p>
    <ul>
      <li>User A sits at the desk and edits a row online on her PC.</li>
      <li>
        User A remembers having edited this row last week in the field when she
        was offline. So she opens the app on her phone and syncs the data.
      </li>
      <li>
        User B edited the same row two weeks ago. But was offline and has not
        synced since. He will sync next week when returning to the office.
      </li>
    </ul>
    <p>
      We&apos;ll call this: A and B worked concurrently on the same row. A even
      worked concurrently on two different devices.
    </p>

    <h3>2. Requirements</h3>

    <p>
      No algorithm can decide what is the true state of this row&apos;s data.
    </p>
    <p>
      Arguably the best solution is: Users A and B realize that conflicts exist
      and can see who edited what and when. This enables them to choose the
      correct state according to their specific business logic.
    </p>

    <p>There needs to be a way to:</p>
    <ul>
      <li>See all changes made to a row, when and by whom</li>
      <li>Automatically detect the existence of conflicts</li>
      <li>Automatically choose a winning version</li>
      <li>Alert users to the existence of conflicts</li>
      <li>Enable users to easily choose/set the correct state</li>
      <li>This should work for deletions as well</li>
    </ul>

    <p>
      Apps can function offline without these requirements. But when users work
      concurrently, edits will be lost. And nobody may notice...
    </p>

    <h3>3. Basic idea</h3>

    <ul>
      <li>Rows are never edited. Instead, every edit creates a new version</li>
      <li>Rows keep a list of their ancestors (preceding versions)</li>
      <li>
        When a row is edited by several users concurrently, the ancestry (tree
        of versions) forks. Following versions create &#34;branches&#34;
      </li>
      <li>
        Deletions are treated like any other edit: &#34;deleted&#34; is just
        another attribute
      </li>
      <li>
        If branches end with a non-deleted version, this version is a conflict
      </li>
      <li>
        Algorithms search for the longest ancestral line ending in an undeleted
        version. They declare this version the winner and give it a list of
        conflicting versions (if existing)
      </li>
    </ul>

    <h3>4. Implementation</h3>
    <p>This is a bit more technical 🤔.</p>
    <p>Still reading? Great 🤗.</p>
    <ul>
      <li>When the user updates or creates a row:</li>
      <ul>
        <li>The app builds a new version with new or updated data,</li>
        <li>documents time of change and user,</li>
        <li>updates the row&apos;s list of ancestors,</li>
        <li>inserts the new version into a queue...</li>
        <li>
          ...that sends it to the server as soon as the internet connection
          allows.
        </li>
      </ul>
      <li>On the server two types of versioned tables exist:</li>
      <ul>
        <li>
          One containing all versions.
          <br />
          This is where the app inserts new versions
        </li>
        <li>
          One containing only the winners.
          <br />
          This is what the app reads
        </li>
      </ul>
      <li>When a new version arrives at the server, a trigger function:</li>
      <ul>
        <li>Chooses the version with the longest ancestry as winner</li>
        <li>
          Checks for conflicts. Conflicts are forks, whose last (most
          descendant) version is not deleted - and thus a conflicting version
        </li>
        <li>If conflicts exist: adds a list of conflicting versions</li>
        <li>
          If the new version wins: updates or inserts the row in the winner
          table with the information of this version
        </li>
      </ul>
      <li>
        Changes in winning tables are immediately synced when the app is active
        and online. Or as soon as that happens
      </li>
      <li>If conflicts exist, the app informs the user</li>
      <li>
        The user can compare the conflicting versions, choose one and if
        necessary edit it to declare the true winner
      </li>
      <li>
        The app then appends this version to the ancestry of the previous
        winner, thus making it the new winner (due to the longest ancestry)
      </li>
      <li>
        It also appends new versions of the previously conflicting versions
        where &#34;deleted&#34; is set to true to their respective branches.
        This makes the server&apos;s algorithm ignore them when choosing
        conflicts in the future
      </li>
    </ul>
  </Container>
)
