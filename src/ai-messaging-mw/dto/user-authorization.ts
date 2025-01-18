import { IsDate, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class AIConfig {
  @IsString()
  @Expose({ name: 'api_key' })
  apiKey: string;

  @IsString()
  @Expose()
  model: string;
}

export class UserAuthDto {
  /**
   * A set of optional updates to be made to a document in the database.
   */

  // Unique identifier for the document.
  @IsString()
  @Expose()
  @Type(() => String)
  id: string;

  // Reference ID for external linkage.
  @Expose({ name: 'reference_id' })
  @IsString()
  @Type(() => String)
  referenceId: string;

  // Configuration for AI integrations.
  @Expose({ name: 'ai_config' })
  @Type(() => AIConfig)
  aiConfig: AIConfig;

  // Date when the document was created.
  @Expose({ name: 'create_date' })
  @IsDate()
  @Type(() => Date)
  createDate?: Date;

  // Date when the document was last updated.
  @Expose({ name: 'update_date' })
  @IsDate()
  @Type(() => Date)
  updateDate?: Date;
}
