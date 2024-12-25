import { NewsletterFetchedUpdate, NewsletterMetadata, NewsletterMute, NewsletterSettingsFollow, NewsletterSettingsMute, NewsletterUpdateParams, NewsletterViewRole, QueryIds, SocketConfig, WAMediaUpload } from '../Types'
import { generateProfilePicture } from '../Utils'
import { getBinaryNodeChildString, BinaryNode, S_WHATSAPP_NET } from '../WABinary'
import { makeGroupsSocket } from './groups'

export const makeNewsletterSocket = (config: SocketConfig) => {
	const sock = makeGroupsSocket(config)
	const { query, generateMessageTag } = sock
	const encoder = new TextEncoder()
	
	const newsletterQuery = async(jid: string | undefined, query_id: QueryIds, content?: object) => (
	    query({
	        tag: "iq",
	        attrs: {
	            id: generateMessageTag(),
	            type: "get",
	            xmlns: "w:mex",
	            to: S_WHATSAPP_NET,
	        },
	        content: [{
	            tag: "query",
	            attrs: {
	                query_id
	            },
	            content: encoder.encode(JSON.stringify({
	                variables: {
	                    newsLetter_id: jid,
	                    ...content
	                }
	            }))
	        }]
        })
    )
	/**
     *
     * @param code https://whatsapp.com/channel/key
     */
     
	const getNewsletterMetadata = async(type: "invite" | "jid", key: string, role?: NewsletterViewRole): Promise<NewsletterMetadata> => {
	    const result = await newsletterQuery(undefined, QueryIds.METADATA, {
	        input: {
	            key,
	            type: type.toUpperCase(),
	            view_role: role || "GUEST"
	            
	        },
	        fetch_viewer_metadata: true,
	        fetch_full_image: true,
	        fetch_creation_time: true
	    })

		const node = getBinaryNodeChildString(result, 'result')
		const json = JSON.parse(node!)
		if(!json.data) {
			throw new Error('Error while fetch newsletter info ' + json)
		}

		return extractNewsLetter(json.data?.xwa2_newsletter)
	}

	const getNewsletters = async(): Promise<[NewsletterMetadata]> => {
		const result = await newsletterQuery(undefined, QueryIds.GETSUBSCRIBED)

		const node = getBinaryNodeChildString(result, 'result')
		const json = JSON.parse(node!)
		if(!json.data) {
			throw new Error('Error while fetch subscribed newsletters ' + json)
		}

		return json.data.xwa2_newsletter_subscribed.map((v: any) => extractNewsLetter(v))
	}

	const createNewsLetter = async(name: string, description?: string, picture?: WAMediaUpload): Promise<NewsletterMetadata> => {

		const result = await newsletterQuery(undefined, QueryIds.CREATE, {
			input: {
				name,
				description: description ?? null,
				picture: picture ? (await generateProfilePicture(picture)).img.toString('base64') : null
			}
		})

		const node = getBinaryNodeChildString(result, 'result')
		const json = JSON.parse(node!)
		if(!json.data) {
			throw new Error('Error while create newsletter ' + json)
		}

		return extractNewsLetter(json.data?.xwa2_newsletter_create)
	}

	const muteNewsletter = async(jid: string, action: NewsletterSettingsMute) => {
		const queryId = action === 'mute' ? QueryIds.MUTE : QueryIds.UNMUTE;
	
		const result = await newsletterQuery(undefined, queryId, {
			'newsletter_id': jid
		});
		
		const node = getBinaryNodeChildString(result, 'result');
		const json = JSON.parse(node!);
		return json;
	};

	const followNewsletter = async(jid: string, action: NewsletterSettingsFollow) => {
		const queryId = action === 'follow' ? QueryIds.FOLLOW : QueryIds.UNFOLLOW
		const result = await newsletterQuery(undefined, queryId, {
			'newsletter_id': jid
		})
		const node = getBinaryNodeChildString(result, 'result')
		const json = JSON.parse(node!)
		return json
	}

	const updateNewsletter = async(jid: string, updates: NewsletterUpdateParams) => {
		const { name, description, picture, reaction } = updates
	
		const result = await newsletterQuery(undefined, QueryIds.JOB_MUTATION, {
			'newsletter_id': jid,
			updates: {
				name: name || undefined,
				description: description || undefined,
				picture: picture ? typeof picture === 'string' ? picture : (await generateProfilePicture(picture)).img.toString('base64') : undefined,
				settings: reaction ? { 'reaction_codes': { value: reaction } } : null
			}
		})
	
		const node = getBinaryNodeChildString(result, 'result')
		const json = JSON.parse(node!);
		if (!json.data) {
			throw new Error('Error while updating newsletter ' + JSON.stringify(json));
		}
	
		return extractNewsLetter(json.data?.xwa2_newsletter_update);
	};

	return {
		...sock,
		getNewsletterMetadata,
		getNewsletters,
		createNewsLetter,
		followNewsletter,
		updateNewsletter,
		muteNewsletter
	}
}

export const extractNewsLetter = (data: any) => {

  const metadata: NewsletterMetadata = {
    id: data.id,
    state: data.state.type,
    creation_time: +data.thread_metadata.creation_time,
    name: data.thread_metadata.name.text,
    name_time: +data.thread_metadata.name.update_time,
    description: data.thread_metadata.description.text,
    description_time: +data.thread_metadata.description.update_time,
    invite: data.thread_metadata.invite,
    handle: data.thread_metadata.handle,
    picture: data.thread_metadata.picture?.direct_path || null,
    preview: data.thread_metadata.preview?.direct_path || null,
    settings: {
		reaction: data.thread_metadata.settings.reaction_codes.value
	},
    subscribers: +data.thread_metadata.subscribers_count,
    verification: data.thread_metadata.verification,
    viewer_metadata: data.viewer_metadata
  }

  return metadata
}