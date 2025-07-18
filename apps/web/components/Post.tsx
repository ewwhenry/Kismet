import type { Post } from '@repo/types';
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuSubTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
} from './ui/context-menu';
import {
  Ban,
  Edit,
  Flag,
  Globe,
  Lock,
  Trash,
  UserCheck,
  UserLock,
  UserRoundCheck,
  Users,
} from 'lucide-react';

export function Post({
  post,
  currentUserIsAuthor,
}: {
  post: Post;
  currentUserIsAuthor: boolean;
}) {
  return (
    <ContextMenu key={post.id}>
      <div className="p-4 rounded-none md:rounded-lg w-full py-10 border-b-1 md:border-none border-zinc-50/10">
        <div className="mb-4 flex flex-row gap-x-2">
          <img
            className="size-10 rounded-full"
            src={
              post.author?.profilePicture ??
              'https://cdn.pfps.gg/pfps/4173-default-14.png'
            }
            alt=""
          />
          <div className="flex flex-col w-full">
            <span className="font-semibold text-foreground">
              {post.author?.name}
            </span>
            <span className="text-xs text-zinc-400">
              @{post.author?.username}
            </span>
          </div>
          <div className="flex flex-row justify-end items-center w-full">
            <button className="bg-blue-400/10 text-blue-400 h-fit px-2 py-1 rounded-full text-sm">
              Seguir
            </button>
          </div>
        </div>

        {/* Envolvemos .parent en un div extra para forzar el padding */}
        <ContextMenuTrigger>
          <div className="w-full">
            {post.content && post.content.length > 0 && (
              <div className="pb-2 text-foreground select-none">
                {post.content}
              </div>
            )}
            {post.media && post.media.length > 0 && (
              <div className="parent gap-1 md:gap-2">
                {post.media!.slice(0, 4).map((media, i) => (
                  <div key={media.id} className={`child${i} png`}>
                    <img
                      src={media.url!}
                      className="w-full h-full object-cover"
                      alt={`media-${i}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </ContextMenuTrigger>
      </div>
      <ContextMenuContent>
        {currentUserIsAuthor ? (
          <>
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Users />
                Change visibility
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>
                  <Globe />
                  Public
                </ContextMenuItem>
                <ContextMenuItem>
                  <UserRoundCheck />
                  Friends
                </ContextMenuItem>
                <ContextMenuItem>
                  <UserLock />
                  Private
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuItem>
              <Edit />
              Edit
            </ContextMenuItem>
            <ContextMenuItem variant="destructive">
              <Trash />
              Delete
            </ContextMenuItem>
          </>
        ) : (
          <>
            <ContextMenuItem variant="destructive">
              <Flag />
              Report
            </ContextMenuItem>
            <ContextMenuItem variant="destructive">
              <Ban />
              Block user
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
