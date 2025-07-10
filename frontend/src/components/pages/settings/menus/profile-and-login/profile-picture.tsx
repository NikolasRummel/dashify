"use client";
import { useSession } from "@/hooks/use-session";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TbLoader } from "react-icons/tb";
import { useCallback } from "react";
import UserAvatar from "@/components/ui/user-avatar";

export default function ChangeProfilePictureSettings() {
	const { user, update } = useSession();
	const changeAvatarSchema = z.object({
		profilePicture: z.string().nonempty(),
	});

	const form = useForm<z.infer<typeof changeAvatarSchema>>({
		resolver: zodResolver(changeAvatarSchema),
		defaultValues: {
			profilePicture: "",
		},
	});

	const handleFileUpload = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = () => {
					form.setValue("profilePicture", reader.result as string, {
						shouldValidate: true,
						shouldDirty: true,
					});
				};
				reader.readAsDataURL(file);
			}
		},
		[form],
	);

	if (!user) return null;

	function onSubmit(data: z.infer<typeof changeAvatarSchema>) {
		update({
			profilePicture: data.profilePicture,
		});
		form.reset();
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
			>
				<div className="flex flex-col gap-4">
					<FormField
						control={form.control}
						name="profilePicture"
						render={() => (
							<FormItem className="flex flex-col gap-4">
								<FormControl>
									<div className="flex flex-row items-center gap-6">
										<UserAvatar size={144} />
										<div className="flex h-36 w-full flex-col gap-4">
											<Input
												type="file"
												accept="image/*"
												onChange={handleFileUpload}
											/>
											<FormMessage />
										</div>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<Separator orientation="horizontal" />
					<div className="flex flex-row gap-2">
						<Button
							type="submit"
							className="w-fit"
							disabled={
								form.formState.isSubmitting ||
								!form.formState.isValid
							}
						>
							{form.formState.isSubmitting && (
								<TbLoader className="text-primary mr-2 animate-spin text-2xl" />
							)}{" "}
							Upload and Save
						</Button>
						<Button
							type="button"
							variant="secondary"
							onClick={() => {
								onSubmit({
									profilePicture: "",
								});
							}}
							disabled={
								form.formState.isSubmitting ||
								!user?.profilePicture
							}
							className="w-fit"
						>
							Remove Profile Picture
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
