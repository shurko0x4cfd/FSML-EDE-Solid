
import './FSMLConsole.css';
import { createSignal } from "solid-js";
import { get_fsml_instance } from 'fsmlang';


const ONLY = 0;

const fsml = get_fsml_instance();
const item_separator = " -> ";


const  FSMLConsole = () => //
{
	const [log_text, set_log_text] = createSignal('');

	const send_news = news => //
	{
		const text = log_text() + news;
		set_log_text(text);
	};

	return (
		<div className='fsml-console'>
			<Fsmlogo />
			<Fsmlog text={log_text()} />
			<Inbox send_news={send_news}  />
		</div>);
}


const logo_text =
	"\n\
	==========================================================\n\
                                FSML                          \n\
	==========================================================\n\
	\n\
	FSML 0.4.1, (c) 2021, 2023 Alexander (Shurko) Stadnichenko\n\
	Type 'help' to FSML help you,\n\
	'license' to view BSD license, 'bb' to farewell\n";


const Fsmlogo = () =>
	<div className='fsmlogo-wrapper'>
		<div className='fsmlogo ws-pre'>
			{logo_text}
		</div>
	</div>;


const Fsmlog = props =>
	<div className='fsmlog ws-pre' children={props.text} />;


const Inbox = props => //
{
	const [text_inbox, set_text_inbox] = createSignal('');

	const enter_handler = evt => //
	{
		evt.preventDefault();
	
		const scroll_amount       = 1000;
		const delay_before_scroll = 200;
	
		let logtext     = text_inbox() ? '\n\n' + text_inbox() : '';
		let eval_result = fsml.eval(text_inbox()) || '';
	
		if (eval_result)
			logtext += '\n\n' + eval_result;
	
		const stack = fsml.stack.type();
		logtext += '\n\n' + '[' + fsml.stack.depth() + ']  ';
	
		if (stack.length)
			logtext += stack.join(item_separator);
	
		set_text_inbox('');
		props .send_news(logtext);
	
		/* Scroll for show prompt */
		setTimeout
			(() => document
				.getElementsByClassName('fsml-console')[ONLY]
				.scrollBy(0, scroll_amount),
				delay_before_scroll);
	};

	const change_handler = evt => set_text_inbox(evt.target.value);

	const Inbox =
		<div className='inbox-wrapper'>
			<div className='prompt'>{'fsml >'}</div>

			<form className='inputform' onSubmit={enter_handler} >
				<input onChange={change_handler}
					name='inbox' 
					className='inbox'
					autoFocus
					value={text_inbox()} />
			</form>
		</div>;
		
	return Inbox;
}


export { FSMLConsole };
