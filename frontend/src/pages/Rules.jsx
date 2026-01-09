import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft } from 'react-icons/fa'
import './Rules.css'

const Rules = () => {
  const navigate = useNavigate()

  return (
    <div className="rules-container">
      <motion.div
        className="rules-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <h1>Hack the Bias Rules and Code of Conduct</h1>

        <div className="rules-section">
          <h2>Code of Conduct</h2>
          <ol className="rules-list">
            <li>
              <strong>Be Respectful:</strong> Treat all participants, mentors, organizers, and volunteers with
              respect. Harassment, discrimination, or inappropriate behavior of any kind is not tolerated.
            </li>
            <li>
              <strong>Be Inclusive:</strong> We welcome participants of all backgrounds and skill levels.
              Support others, share knowledge, and help create a friendly, beginner-friendly environment.
            </li>
            <li>
              <strong>Keep it Fair:</strong> All projects must be developed entirely within the official
              hacking timeframe. Your project must be hosted on a public GitHub repository with an
              open-source license. Pre-existing code, libraries, or assets are not permitted unless
              explicitly approved by organizers. We reserve the right to audit any project if commit
              history, timing, or other factors appear suspicious. Violations of this rule may result in
              penalties including disqualification and removal from the event.
            </li>
            <li>
              <strong>Keep It Professional:</strong> Use appropriate language and behavior. Do not engage
              in disruptive, unsafe, or hostile conduct.
            </li>
            <li>
              <strong>Collaborate Fairly:</strong> Contribute honestly. Do not sabotage, steal, or copy
              others’ work without permission. Follow rules regarding project originality and allowed
              tools.
            </li>
            <li>
              <strong>Respect Privacy:</strong> Do not share personal information, photos, or project ideas
              without consent.
            </li>
            <li>
              <strong>Follow Venue & Safety Rules:</strong> Respect the physical space; keep the area clean
              and safe.
            </li>
            <li>
              <strong>Ask for Help:</strong> If you witness or experience issues, contact an organizer
              immediately.
            </li>
            <li>
              <strong>Consequences:</strong> Organizers reserve the right to remove participants who
              violate the Code of Conduct.
            </li>
          </ol>
          <p>
            Hack the Bias is dedicated to providing a harassment-free experience for everyone.
          </p>
          <p>
            We do not tolerate harassment of participants, organizers, mentors, judges, or volunteers in any form. Participants violating these
            rules may be sanctioned or expelled from the event at the discretion of the organizers.
          </p>
        </div>

        <div className="rules-section">
          <h2>Check-In Requirement</h2>
          <p>
            All participants are required to <strong>check in on both Friday, January 16th and Saturday January 17th</strong>,
            as outlined in the official event schedule.
          </p>
          <p>
            Failure to check in on both days may result in disqualification from judging or removal
            from the event.
          </p>
          <p>
            Please refer to the full schedule in the{" "}
            <a
              href="https://www.notion.so/Hack-the-Bias-Event-Guide-2ae21d407f5080c19d42d200fed62d47#2ae21d407f5080289fa0efe81fd9918d"
              target="_blank"
              rel="noopener noreferrer"
            >
              Event Guide
            </a>
            .
          </p>
        </div>

        <div className="rules-section">
          <h2>General Rules</h2>
          <ul>
            <li>All projects must be started from scratch at the beginning of the hackathon.</li>
            <li>All code must be written during the hackathon period.</li>
            <li>Pre-existing libraries, frameworks, and APIs are allowed.</li>
            <li>Projects must align with the hackathon theme of social justice, inclusion, and equity.</li>
            <li>Teams must consist of <strong>2–5 participants</strong>.</li>
            <li>Participants may only compete in <strong>one competition tier</strong> (Beginner or Regular).</li>
            <li>Misrepresenting experience level (e.g. falsely competing in the Beginner tier) may result in disqualification.</li>
          </ul>
        </div>

        <div className="rules-section">
          <h2>Hardware & Tools</h2>
          <ul>
            <li>No hardware will be provided by the organizers.</li>
            <li>Participants may bring personal or commercially available hardware.</li>
            <li>Total additional hardware cost per project must be <strong>under $1000 CAD</strong> (excluding laptops and personal devices).</li>
            <li>Restricted, industrial, or specialized lab equipment is not permitted.</li>
          </ul>
        </div>

        <div className="rules-section">
          <h2>Artificial Intelligence (AI) Policy</h2>
          <p>
            Generative AI tools (ChatGPT, GitHub Copilot, Claude, etc.) are <strong>permitted</strong> for code generation, 
            debugging, content creation, and research assistance.
          </p>
          <p>
            <strong>Understanding Requirement:</strong> You must be able to explain and modify any AI-generated 
            code or content in your submission. Judges may ask detailed questions about implementation details.
          </p>
          <ul>
            <li><strong>Permitted:</strong> Using AI for coding assistance, debugging, research, and content creation</li>
            <li><strong>Required:</strong> Complete understanding of all AI-generated code and content</li>
            <li><strong>Prohibited:</strong> Blind copying without understanding or claiming AI work as entirely original</li>
            <li><strong>Enforcement:</strong> Teams unable to explain their solution may face disqualification</li>
          </ul>
          <p>
            Above all, use AI responsibly and avoid exposing sensitive data.
          </p>
        </div>

        <div className="rules-section">
          <h2>Commercial Promotion Policy</h2>
          <p>
            Hack the Bias is dedicated to fostering innovation and learning. Unauthorized commercial promotion 
            detracts from the collaborative hackathon environment.
          </p>
          <ul>
            <li><strong>Prohibited:</strong> Promoting personal businesses, external projects, or services through physical materials (signs, posters, t-shirts, banners, etc.)</li>
            <li><strong>Prohibited:</strong> Creating media content (photos, videos, livestreams) that primarily promotes personal businesses or projects unrelated to the hackathon</li>
            <li><strong>Prohibited:</strong> Distributing business cards, flyers, or promotional materials for external ventures</li>
            <li><strong>Focus:</strong> All presentations and demonstrations should center on work developed during the hackathon period</li>
          </ul>
          <p>
            <strong>Exceptions:</strong> Official event sponsors and organizations with explicit organizer permission 
            are exempt from this policy. Contact organizers for approval of any promotional materials.
          </p>
          <p>
            <strong>Enforcement:</strong> Violating this policy may result in removal of materials, disqualification, 
            or expulsion from the event.
          </p>
        </div>

        <div className="rules-section">
          <h2>Expected Behavior</h2>
          <ul>
            <li>Be respectful and inclusive in all interactions.</li>
            <li>Listen actively and be open to different perspectives.</li>
            <li>Help create a welcoming, beginner-friendly environment.</li>
            <li>Respect privacy — do not share others' ideas or personal information without consent.</li>
            <li>Follow venue safety rules and organizer instructions at all times.</li>
            <li>Report any concerns to event organizers immediately.</li>
          </ul>
        </div>

        <div className="rules-section">
          <h2>Enforcement</h2>
          <p>
            Organizers reserve the right to remove or disqualify any participant or team
            that violates these rules, the Code of Conduct, or misrepresents eligibility,
            experience level, or project originality.
          </p>
        </div>

        <div className="rules-placeholder">
          <p>
            <em>
              This page is a summary of key rules. Full details are available in the Event Guide
              and will be finalized before the event.
            </em>
          </p>
        </div>
      </motion.div>
    </div>
  )
}


export default Rules
